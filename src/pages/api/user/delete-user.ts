// pages/api/auth/delete-user.js
import { getConnectedClient } from "@/lib/database/mongodb";
import { ResponseError, sendResponseError } from "@/lib/helpers/errors";
import { logger } from "@/lib/helpers/logger";
import { ErrorMessages, SuccessMessages } from "@/lib/helpers/messages";
import { ResponseData } from "@/lib/types/api";
import { v2 as cloudinary } from "cloudinary";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getNextAuthOptions } from "../auth/[...nextauth]";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Deletes a user and their associated images from the database and Cloudinary.
 *
 * @param {NextApiRequest} req - The HTTP request object.
 * @param {NextApiResponse} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the user is deleted.
 * @throws {Error} - If the HTTP method is not DELETE, the user session is not found, or an error occurs during the process.
 */
export default async function deleteUserHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    // Check if the HTTP method is DELETE
    if (req.method !== "DELETE") {
      throw new ResponseError(StatusCodes.METHOD_NOT_ALLOWED, ErrorMessages.MethodNotAllowed);
    }

    // Retrieve the user session
    const session = await getServerSession(req, res, getNextAuthOptions());

    // Check if the session and user exist
    if (!session || !session.user) {
      throw new ResponseError(StatusCodes.UNAUTHORIZED, ErrorMessages.UserNotAuthorized);
    }

    // Construct the public ID of the user's folder in Cloudinary
    const userFolderPublicId = `${process.env.CLOUDINARY_MAIN_FOLDER}/${session.user.email}`;

    // Delete all resources with the specified public ID from Cloudinary
    const deleteResourcesResponse =
      await cloudinary.api.delete_resources_by_prefix(userFolderPublicId);
    logger.info(`deleteResourcesResponse: ${deleteResourcesResponse}`);

    if (!deleteResourcesResponse) {
      throw new ResponseError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.ImagesDeleteFailed);
    }

    // Delete the user's folder from Cloudinary
    const deleteFolderResponse = await cloudinary.api.delete_folder(userFolderPublicId);
    logger.info(`deleteFolderResponse: ${deleteFolderResponse}`);
    if (!deleteFolderResponse) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorMessages.ImageFolderDeleteFailed
      );
    }

    // Connect to the database
    const mongoClient = await getConnectedClient();
    if (!mongoClient) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorMessages.DatabaseConnectionFailed
      );
    }

    // Get the users collection from the database
    const databaseName = process.env.MONGODB_DATABASE;
    const usersCollectionName = process.env.MONGODB_USERS_COLLECTION!;
    const usersCollection = mongoClient.db(databaseName).collection(usersCollectionName);

    // Delete the user from the database
    const userDeleteResult = await usersCollection.deleteOne({ email: session.user.email });
    if (userDeleteResult.deletedCount < 1) {
      throw new ResponseError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.UserDeleteFailed);
    }

    const usersOperationsCollectionName = process.env.MONGODB_USERS_OPERATIONS_COLLECTION!;
    const usersOperationsCollection = mongoClient
      .db(databaseName)
      .collection(usersOperationsCollectionName);
    const userOperationsDeleteResult = await usersOperationsCollection.deleteOne({
      email: session.user.email,
    });
    if (userOperationsDeleteResult.deletedCount < 1) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorMessages.UserOperationsDeleteFailed
      );
    }

    const usersInventoryStatsCollectionName = process.env.MONGODB_USERS_INVENTORY_STATS_COLLECTION!;
    const usersInventoryStatsCollection = mongoClient
      .db(databaseName)
      .collection(usersInventoryStatsCollectionName);
    const userInventoryStatsDeleteResult = await usersInventoryStatsCollection.deleteOne({
      email: session.user.email,
    });
    if (userInventoryStatsDeleteResult.deletedCount < 1) {
      throw new ResponseError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ErrorMessages.UserInventoryStatsDeleteFailed
      );
    }

    // Return a success message with the deleted user information
    const data: ResponseData = {
      type: "success",
      message: SuccessMessages.UserDeleted,
    };
    res.status(StatusCodes.OK).json(data);
  } catch (error) {
    // Handle any errors that occur during the process
    sendResponseError(error, res);
  }
}
