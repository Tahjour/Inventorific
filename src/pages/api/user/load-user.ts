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
import { getNextAuthOptions } from "../auth/[...nextauth]";

export default async function loadUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    /**
     * Retrieves user data from a MongoDB database based on the user's session.
     *
     * @param req - The Next.js API request object.
     * @param res - The Next.js API response object.
     * @returns JSON response with the user's data.
     * @throws {ResponseError} - If the request method is not "GET".
     * @throws {ResponseError} - If there is no session or no user in the session.
     * @throws {ResponseError} - If the database connection fails.
     * @throws {ResponseError} - If no user is found in the database.
     * @throws {ResponseError} - If no user operations data is found in the database.
     */

    // Check if the request method is "GET". If not, throw an error.
    if (req.method !== "GET") {
      throw new ResponseError(StatusCodes.METHOD_NOT_ALLOWED, ErrorMessages.MethodNotAllowed);
    }

    // Get the user's session using `getServerSession` function and `getNextAuthOptions`.
    const session = await getServerSession(req, res, getNextAuthOptions());

    // If there is no session or no user in the session, throw an "UserNotAuthorized" error.
    if (!session || !session.user) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ type: "error", message: ErrorMessages.UserNotAuthorized });
      return;
    }

    // Get the database and collection names from environment variables.
    const databaseName = process.env.MONGODB_DATABASE;
    const collectionName = process.env.MONGODB_USERS_COLLECTION!;

    // Connect to the MongoDB database using `getConnectedClient` function.
    const mongoClient = await getConnectedClient();
    if (!mongoClient) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorMessages.DatabaseConnectionFailed
      );
    }

    // Retrieve the user's data from the database based on the email in the session.
    const users = mongoClient.db(databaseName).collection(collectionName);
    const existingUser = await users.findOne({ email: session.user.email });

    // If no user is found, throw a "Not Found" error.
    if (!existingUser) {
      throw new ResponseError(StatusCodes.NOT_FOUND, ErrorMessages.UserNotFound);
    }

    const usersOperationsCollectionName = process.env.MONGODB_USERS_OPERATIONS_COLLECTION!;
    const usersOperationsCollection = mongoClient
      .db(databaseName)
      .collection(usersOperationsCollectionName);

    const existingUserOperations = await usersOperationsCollection.findOne({
      email: session.user.email,
    });

    if (!existingUserOperations) {
      logger.info("No user operations data found");
    }

    const usersInventoryStatsCollectionName = process.env.MONGODB_USERS_INVENTORY_STATS!;
    const usersInventoryStatsCollection = mongoClient
      .db(databaseName)
      .collection(usersInventoryStatsCollectionName);

    const existingUserInventoryStats = await usersInventoryStatsCollection.findOne({
      email: session.user.email,
    });
    if (!existingUserInventoryStats) {
      logger.info("No user inventory stats data found");
    }

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
      user_operations: existingUserOperations?.operations,
      user_inventory_stats: {
        total_items_history: existingUserInventoryStats?.total_items_history,
        total_items_price_history: existingUserInventoryStats?.total_items_price_history,
        total_items_amount_history: existingUserInventoryStats?.total_items_amount_history,
      },
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
