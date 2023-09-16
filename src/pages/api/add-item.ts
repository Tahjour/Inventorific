//pages/api/auth/add-item.ts
import { getConnectedClient } from "@/lib/database/mongodb";
import { getFormattedDate } from "@/lib/helpers/date";
import { ResponseError, sendResponseError } from "@/lib/helpers/errors";
import { ErrorMessages, SuccessMessages } from "@/lib/helpers/messages";
import { ResponseData } from "@/lib/types/api";
import { MongodbItem } from "@/lib/types/item";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getNextAuthOptions } from "./auth/[...nextauth]";

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
/**
 * Handles the logic for adding a new item to a user's collection.
 * @param {NextApiRequest} req - The request object containing the form data.
 * @param {NextApiResponse} res - The response object used to send the response.
 * @returns {Promise<void>} - A promise that resolves when the function is done executing.
 */
export default async function addItemHandler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    // Check if the request method is "POST". If not, send a "Method not allowed" response.
    if (req.method !== "POST") {
      throw new ResponseError(StatusCodes.METHOD_NOT_ALLOWED, ErrorMessages.MethodNotAllowed);
    }

    const form = formidable({ multiples: true });

    form.parse(req, async (error, fields, files) => {
      try {
        if (error) {
          throw new ResponseError(StatusCodes.BAD_REQUEST, ErrorMessages.FormParseFailed);
        }

        // Get the user session using `getServerSession` and `getNextAuthOptions`.
        const session = await getServerSession(req, res, getNextAuthOptions());

        // Check if the session and user exist. If not, throw an error.
        if (!session || !session.user) {
          throw new ResponseError(StatusCodes.UNAUTHORIZED, ErrorMessages.UserNotAuthorized);
        }

        let newItemImageURL = process.env.CLOUDINARY_DEFAULT_IMAGE_URL!;

        // If an item image file is provided, upload it to Cloudinary and get the secure URL.
        if (files.newItemImageFile) {
          const newItemImageFile = files.newItemImageFile[0].filepath;
          const mainFolder = `${process.env.CLOUDINARY_MAIN_FOLDER!}`;
          const userFolder = `${session.user.name} (${session.user.email})`;
          const userItemImage = `${fields.newItemName} (${fields.newItemID})`;
          const newPublicID = `${mainFolder}/${userFolder}/${userItemImage}`;

          const uploadResponse = await cloudinary.uploader.upload(newItemImageFile, {
            public_id: newPublicID,
          });
          if (!uploadResponse || !uploadResponse.secure_url) {
            throw new ResponseError(
              StatusCodes.INTERNAL_SERVER_ERROR,
              ErrorMessages.ImageUploadFailed
            );
          }
          newItemImageURL = uploadResponse.secure_url;
        }

        // Create a new item object using the form fields and the item image URL.
        const newItem: MongodbItem = {
          id: fields.newItemID[0],
          name: fields.newItemName[0],
          price: fields.newItemPrice[0],
          amount: fields.newItemAmount[0],
          description: fields.newItemDescription[0],
          imageURL: newItemImageURL,
          date_created: fields.newItemCreatedDate[0],
          time_created: fields.newItemCreatedTime[0],
          date_modified: fields.newItemModifiedDate[0],
          time_modified: fields.newItemModifiedTime[0],
        };

        const mongoClient = await getConnectedClient();
        if (!mongoClient) {
          throw new ResponseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorMessages.DatabaseConnectionFailed
          );
        }

        const databaseName = process.env.MONGODB_DATABASE!;
        const usersCollectionName = process.env.MONGODB_USERS_COLLECTION!;
        const usersCollection = mongoClient.db(databaseName).collection(usersCollectionName);

        // Find the user in the database using the session user's email.
        const existingUser = await usersCollection.findOne({ email: session.user.email });

        if (!existingUser) {
          throw new ResponseError(StatusCodes.NOT_FOUND, ErrorMessages.UserNotFound);
        }

        // Update the user's items array with the new item using `updateOne`.
        const itemsUpdateResult = await usersCollection.updateOne(
          { email: session.user.email },
          { $push: { items: newItem } }
        );
        if (itemsUpdateResult.modifiedCount < 1) {
          throw new ResponseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorMessages.ItemCreationFailed
          );
        }

        const usersOperationsCollectionName = process.env.MONGODB_USERS_OPERATIONS_COLLECTION!;
        const usersOperationsCollection = mongoClient
          .db(databaseName)
          .collection(usersOperationsCollectionName);

        const operationsUpdateResult = await usersOperationsCollection.updateOne(
          { email: session.user.email, date: getFormattedDate() },
          { $inc: { item_additions: 1, item_edits: 0, item_deletions: 0 } },
          { upsert: true }
        );

        if (operationsUpdateResult.upsertedCount < 1 && operationsUpdateResult.modifiedCount < 1) {
          throw new ResponseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorMessages.UserOperationsUpdateFailed
          );
        }

        // Send a response with a success message and the new item details.
        const data: ResponseData = {
          type: "success",
          message: SuccessMessages.ItemAdded,
          uploadedItem: newItem,
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
