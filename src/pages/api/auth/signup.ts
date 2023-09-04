// src\pages\api\auth\signup.ts
import { hashPassword } from "@/lib/auth/user-validation/server";
import { getConnectedClient } from "@/lib/database/mongodb";
import { getFormattedDate, getFormattedTime } from "@/lib/helpers/date";
import { ResponseError, sendResponseError } from "@/lib/helpers/errors";
import { ErrorMessages, SuccessMessages } from "@/lib/helpers/messages";
import { ResponseData } from "@/lib/types/api";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";

export default async function signUpHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      throw new ResponseError(StatusCodes.METHOD_NOT_ALLOWED, ErrorMessages.MethodNotAllowed);
    }

    const { name, email, password } = req.body;

    const mongoClient = await getConnectedClient();
    if (!mongoClient) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorMessages.DatabaseConnectionFailed
      );
    }
    const database = process.env.MONGODB_DATABASE;
    const collection = process.env.MONGODB_USERS_COLLECTION!;
    const users = mongoClient.db(database).collection(collection);

    const existingUser = await users.findOne({ email: email });

    if (existingUser) {
      throw new ResponseError(StatusCodes.NOT_FOUND, ErrorMessages.UserNotFound);
    }

    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorMessages.PasswordGenerateFailed
      );
    }

    const userDoc = {
      type: "credentials",
      date_created: getFormattedDate(),
      time_created: getFormattedTime(),
      name: name,
      email: email,
      password: hashedPassword,
      items: [],
    };

    const insertResult = await users.insertOne(userDoc);
    if (!insertResult || !insertResult.insertedId) {
      throw new ResponseError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.UserCreationFailed);
    }
    const data: ResponseData = {
      type: "success",
      message: SuccessMessages.UserCreated,
    };
    res.status(StatusCodes.OK).json(data);
    return;
  } catch (error) {
    sendResponseError(error, res);
  }
}
