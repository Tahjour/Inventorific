import { getConnectedClient } from "@/lib/database/mongodb";
import { ResponseError, handleError } from "@/lib/helpers/errors";
import { ErrorMessages, SuccessMessages } from "@/lib/helpers/messages";
import { ItemResponseData } from "@/lib/types/item";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if the request method is "POST". If not, send a "Method not allowed" response.
    if (req.method !== "POST") {
      throw new ResponseError(StatusCodes.METHOD_NOT_ALLOWED, ErrorMessages.MethodNotAllowed);
    }
    // Parse the FormData
    const form = formidable({ multiples: true });
    form.parse(req, async (error, fields, files) => {
      try {
        if (error) {
          throw new ResponseError(StatusCodes.BAD_REQUEST, ErrorMessages.FormParseFailed);
        }

        const session = await getServerSession(req, res, authOptions);

        if (!session || !session.user) {
          throw new ResponseError(StatusCodes.UNAUTHORIZED, ErrorMessages.UserNotAuthorized);
        }

        if (fields.itemToDeleteImageURL[0] !== process.env.CLOUDINARY_DEFAULT_IMAGE_URL) {
          // Define the existing image public ID
          const mainFolder = `${process.env.CLOUDINARY_MAIN_FOLDER}`;
          const userFolder = `${session.user.name} (${session.user.email})`;
          const userItemImage = `${fields.itemToDeleteName} (${fields.itemToDeleteID})`;
          const existingImagePublicId = `${mainFolder}/${userFolder}/${userItemImage}`;

          // Delete the existing image from Cloudinary
          const destroyResponse = await cloudinary.uploader.destroy(existingImagePublicId);
          if (!destroyResponse || destroyResponse.result !== "ok") {
            throw new ResponseError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              ErrorMessages.ImageDeleteFailed
            );
          }
        }

        // Connect to the MongoDB database
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

        // Find the existing user in the database
        const existingUser = await users.findOne({ email: session.user.email });
        if (!existingUser) {
          throw new ResponseError(StatusCodes.NOT_FOUND, ErrorMessages.UserNotFound);
        }

        // Delete the item for the existing user
        const deleteResponse = await users.updateOne(
          { email: session.user.email },
          { $pull: { items: { id: fields.itemToDeleteID[0] } } }
        );
        if (!deleteResponse || deleteResponse.modifiedCount === 0) {
          throw new ResponseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorMessages.ItemDeleteFailed
          );
        }
        const data: ItemResponseData = {
          type: "success",
          message: SuccessMessages.ItemDeleted,
        };
        // Send a response after the deletion
        res.status(StatusCodes.OK).json(data);
      } catch (error) {
        handleError(res, error);
      }
    });
  } catch (error) {
    handleError(res, error);
  }
}

/**
 * Handles HTTP POST requests to delete an item from the user's collection in the MongoDB database.
 * @param {NextApiRequest} req - The HTTP request object.
 * @param {NextApiResponse} res - The HTTP response object.
 * @returns {Promise<void>} - The HTTP response with the result of the deletion as JSON.
 * @throws {ResponseError} - If the request method is not "POST", form parsing fails, authentication or authorization checks fail, image deletion fails, database connection fails, user is not found, or item deletion fails.
 */
