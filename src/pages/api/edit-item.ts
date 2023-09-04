import { getConnectedClient } from "@/lib/database/mongodb";
import { ResponseError, sendResponseError } from "@/lib/helpers/errors";
import { logger } from "@/lib/helpers/logger";
import { ErrorMessages, SuccessMessages } from "@/lib/helpers/messages";
import { ResponseData } from "@/lib/types/api";
import { MongodbItem } from "@/lib/types/item";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getNextAuthOptions } from "./auth/[...nextauth]";

// API configuration to disable the default bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * The handler function for the API endpoint that processes the request to edit an item
 * and updates the corresponding image in Cloudinary, if necessary.
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if the request method is POST, otherwise return a "Method not allowed" error
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

        // Check if the user is authenticated, return an "UserNotAuthorized" error if not
        const session = await getServerSession(req, res, getNextAuthOptions());
        if (!session || !session.user) {
          throw new ResponseError(StatusCodes.UNAUTHORIZED, ErrorMessages.UserNotAuthorized);
        }

        const {
          itemToEditID,
          itemToEditName,
          itemToEditCreatedDate,
          itemToEditCreatedTime,
          itemToEditImageURL,
          editedItemID,
          editedItemName,
          editedItemPrice,
          editedItemAmount,
          editedItemDescription,
          editedItemModifiedDate,
          editedItemModifiedTime,
          editedItemImageURL,
        } = fields;

        const mainFolder = `${process.env.CLOUDINARY_MAIN_FOLDER}`;
        const userFolder = `${session.user.name} (${session.user.email})`;
        const itemToEditImageFolder = `${itemToEditName} (${itemToEditID})`;
        const editedItemImageFolder = `${editedItemName} (${editedItemID})`;
        const itemToEditImagePublicId = `${mainFolder}/${userFolder}/${itemToEditImageFolder}`;
        const editedItemImagePublicId = `${mainFolder}/${userFolder}/${editedItemImageFolder}`;
        let updatedImageURL = editedItemImageURL[0];

        if (!files.editedItemImageFile) {
          //if edited image file is not provided
          if (
            editedItemImageURL[0] !== process.env.CLOUDINARY_DEFAULT_IMAGE_URL &&
            itemToEditImagePublicId.toLowerCase() !== editedItemImagePublicId.toLowerCase()
          ) {
            logger.info(`renaming ${itemToEditImagePublicId} to ${editedItemImagePublicId}`);
            const renameResponse = await cloudinary.uploader.rename(
              itemToEditImagePublicId,
              editedItemImagePublicId
            );
            if (!renameResponse || !renameResponse.secure_url) {
              throw new ResponseError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                ErrorMessages.ImageUploadFailed
              );
            }
            updatedImageURL = renameResponse.secure_url;
          }
        }
        if (files.editedItemImageFile) {
          //if edited image file is provided
          const editedItemImageFile = files.editedItemImageFile[0].filepath;
          if (itemToEditImageURL[0] !== process.env.CLOUDINARY_DEFAULT_IMAGE_URL) {
            const destroyResponse = await cloudinary.uploader.destroy(itemToEditImagePublicId);
            if (!destroyResponse || destroyResponse.result !== "ok") {
              throw new ResponseError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                ErrorMessages.ImageDeleteFailed
              );
            }
          }
          const uploadResponse = await cloudinary.uploader.upload(editedItemImageFile, {
            public_id: editedItemImagePublicId,
          });
          if (!uploadResponse || !uploadResponse.secure_url) {
            throw new ResponseError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              ErrorMessages.ImageUploadFailed
            );
          }
          updatedImageURL = uploadResponse.secure_url;
        }

        // Create the edited item object
        const editedItem: MongodbItem = {
          id: editedItemID[0],
          name: editedItemName[0],
          price: editedItemPrice[0],
          amount: editedItemAmount[0],
          description: editedItemDescription[0],
          imageURL: updatedImageURL,
          date_created: itemToEditCreatedDate[0],
          time_created: itemToEditCreatedTime[0],
          date_modified: editedItemModifiedDate[0],
          time_modified: editedItemModifiedTime[0],
        };

        // Connect to the MongoDB database
        const mongoClient = await getConnectedClient();
        if (!mongoClient)
          throw new ResponseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorMessages.DatabaseConnectionFailed
          );

        const database = process.env.MONGODB_DATABASE;
        const collection = process.env.MONGODB_USERS_COLLECTION!;
        const users = mongoClient.db(database).collection(collection);

        // Find the existing user in the database
        const existingUser = await users.findOne({ email: session.user.email });
        if (!existingUser)
          throw new ResponseError(StatusCodes.NOT_FOUND, ErrorMessages.UserNotFound);

        // Update the item for the existing user
        const updateResult = await users.updateOne(
          { email: session.user.email, "items.id": fields.editedItemID[0] },
          { $set: { "items.$": editedItem } }
        );
        if (!updateResult || updateResult.modifiedCount === 0) {
          throw new ResponseError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.ItemEditFailed);
        }

        // Send a response after the update
        const data: ResponseData = {
          type: "success",
          message: SuccessMessages.ItemEdited,
          editedItem: editedItem,
        };
        res.status(StatusCodes.OK).json(data);
      } catch (error) {
        sendResponseError(error, res);
      }
    });
  } catch (error) {
    sendResponseError(error, res);
  }
}
