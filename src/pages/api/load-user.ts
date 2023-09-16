// src\pages\api\load-user.ts
import { getConnectedClient } from "@/lib/database/mongodb";
import { ResponseError, sendResponseError } from "@/lib/helpers/errors";
import { logger } from "@/lib/helpers/logger";
import { ErrorMessages, SuccessMessages } from "@/lib/helpers/messages";
import { ResponseData } from "@/lib/types/api";
import { UserInfo } from "@/lib/types/user";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getNextAuthOptions } from "./auth/[...nextauth]";

export default async function loadUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if the request method is "GET". If not, throw an error.
    if (req.method !== "GET") {
      throw new ResponseError(StatusCodes.METHOD_NOT_ALLOWED, ErrorMessages.MethodNotAllowed);
    }

    // Get the user's session using `getServerSession` function and `getNextAuthOptions`.
    const session = await getServerSession(req, res, getNextAuthOptions());

    // If there is no session or no user in the session, throw an "UserNotAuthorized" error.
    if (!session || !session.user) {
      throw new ResponseError(StatusCodes.UNAUTHORIZED, ErrorMessages.UserNotAuthorized);
    }

    // Get the database and collection names from environment variables.
    const databaseName = process.env.MONGODB_DATABASE;
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
    const users = mongoClient.db(databaseName).collection(collection);
    const existingUser = await users.findOne({ email: session.user.email });

    // If no user is found, throw a "Not Found" error.
    if (!existingUser) {
      throw new ResponseError(StatusCodes.NOT_FOUND, ErrorMessages.UserNotFound);
    }

    const usersOperationsCollectionName = process.env.MONGODB_USERS_OPERATIONS_COLLECTION!;
    const usersOperationsCollection = mongoClient
      .db(databaseName)
      .collection(usersOperationsCollectionName);
    const existingUserOperations = await usersOperationsCollection
      .find({ email: session.user.email }).toArray();

    // Create a `userInfo` object with the user's data.
    const userInfo: UserInfo = {
      login_type: existingUser.login_type,
      name: existingUser.name,
      email: existingUser.email,
      image: existingUser.image,
      items: existingUser.items,
      date_created: existingUser.date_created,
      time_created: existingUser.time_created,
      preferred_list_type: existingUser.preferred_list_type,
      user_operations: existingUserOperations,
    };
    // Create a `data` object with a success message and the `userInfo`.
    const data: ResponseData = {
      type: "success",
      message: SuccessMessages.UserDataLoaded,
      userInfo,
    };

    // Set the response status to 200 (OK) and send the `data` object as JSON.
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    sendResponseError(error, res);
  }
}

/**
 * Loads user data from a MongoDB database.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @returns The user's data as a JSON response with a success message, or an error message as a JSON response with the appropriate status code.
 *
 * @example
 * Request:
 * GET /api/loadUser
 *
 * Response:
 * {
 *   "type": "success",
 *   "message": "User data loaded successfully",
 *   "userInfo": {
 *     "login_type": "oauth",
 *     "name": "John Doe",
 *     "email": "john@example.com",
 *     "image": "https://example.com/profile.jpg",
 *     "items": [],
 *     "date_created": "2022-01-01",
 *     "time_created": "12:00:00"
 *   }
 * }
 */
