// src\pages\api\load-user.ts
import { getConnectedClient } from "@/lib/database/mongodb";
import { ResponseError, sendResponseError } from "@/lib/helpers/errors";
import { ErrorMessages, SuccessMessages } from "@/lib/helpers/messages";
import { ResponseData } from "@/lib/types/api";
import { ListType } from "@/lib/types/list";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getNextAuthOptions } from "./auth/[...nextauth]";

export default async function saveListTypeHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if the request method is "GET". If not, throw an error.
    if (req.method !== "POST") {
      throw new ResponseError(StatusCodes.METHOD_NOT_ALLOWED, ErrorMessages.MethodNotAllowed);
    }

    const { preferredListType }: { preferredListType: ListType } = req.body;

    // Get the user's session using `getServerSession` function and `getNextAuthOptions`.
    const session = await getServerSession(req, res, getNextAuthOptions());

    // If there is no session or no user in the session, throw an "UserNotAuthorized" error.
    if (!session || !session.user) {
      throw new ResponseError(StatusCodes.UNAUTHORIZED, ErrorMessages.UserNotAuthorized);
    }

    // Get the database and collection names from environment variables.
    const database = process.env.MONGODB_DATABASE;
    const collection = process.env.MONGODB_USERS_COLLECTION!;

    // Connect to the MongoDB database using `getConnectedClient` function.
    const mongoClient = await getConnectedClient();
    if (!mongoClient) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorMessages.DatabaseConnectionFailed
      );
    }

    // Retrieve the user's data from the database based on the email in the session.
    const users = mongoClient.db(database).collection(collection);
    const updateResult = await users.updateOne(
      { email: session.user.email },
      { $set: { preferred_list_type: preferredListType } }
    );

    if (updateResult.matchedCount < 1 && updateResult.modifiedCount < 1) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorMessages.PreferredListTypeSaveFailed
      );
    }
    const data: ResponseData = {
      type: "success",
      message: SuccessMessages.PreferredListTypeSaved,
    };
    // Set the response status to 200 (OK) and send the `data` object as JSON.
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    sendResponseError(error, res);
  }
}
