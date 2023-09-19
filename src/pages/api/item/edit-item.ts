import { getConnectedClient } from "@/lib/database/mongodb";
import { ResponseError, sendResponseError } from "@/lib/helpers/errors";
import { ErrorMessages, SuccessMessages } from "@/lib/helpers/messages";
import { ResponseData } from "@/lib/types/api";
import { MongodbItem } from "@/lib/types/item";
import { UserInventoryStat } from "@/lib/types/stats";
import { UserOperationsData } from "@/lib/types/user";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { getNextAuthOptions } from "../auth/[...nextauth]";

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
        const mainFolder = `${process.env.CLOUDINARY_MAIN_FOLDER}`;
        const userFolder = `${session.user.email}`;

        const itemToEditName =
          fields.itemToEditName[0].length > 30
            ? `${fields.itemToEditName[0].slice(0, 30)}...`
            : fields.itemToEditName[0];
        const itemToEditID = fields.itemToEditID[0];

        const editedItemName =
          fields.editedItemName[0].length > 30
            ? `${fields.editedItemName[0].slice(0, 30)}...`
            : fields.editedItemName[0];
        const editedItemID = fields.editedItemID[0];

        const itemToEditImage = `${itemToEditName} (${itemToEditID})`;
        const editedItemImage = `${editedItemName} (${editedItemID})`;
        const itemToEditImagePublicId = `${mainFolder}/${userFolder}/${itemToEditImage}`;
        const editedItemImagePublicId = `${mainFolder}/${userFolder}/${editedItemImage}`;
        let updatedImageURL = fields.editedItemImageURL[0];

        //if edited image file is not provided
        if (!files.editedItemImageFile) {
          // Checking if the user didn't change the image, but changed the name of the item
          // Since the cloudinary image folder uses the name of the item,
          // a simple rename is made to the existing image folder in Cloudinary instead of deleting and then reuploading
          if (
            fields.editedItemImageURL[0] !== process.env.CLOUDINARY_DEFAULT_IMAGE_URL &&
            itemToEditImagePublicId.toLowerCase() !== editedItemImagePublicId.toLowerCase()
          ) {
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
        //if edited image file is provided
        if (files.editedItemImageFile) {
          const editedItemImageFile = files.editedItemImageFile[0].filepath;
          if (fields.itemToEditImageURL[0] !== process.env.CLOUDINARY_DEFAULT_IMAGE_URL) {
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
          id: fields.editedItemID[0],
          name: fields.editedItemName[0],
          price: parseFloat(fields.editedItemPrice[0]),
          amount: parseFloat(fields.editedItemAmount[0]),
          description: fields.editedItemDescription[0],
          imageURL: updatedImageURL,
          date_created: fields.itemToEditCreatedDate[0],
          time_created: fields.itemToEditCreatedTime[0],
          date_modified: fields.editedItemModifiedDate[0],
          time_modified: fields.editedItemModifiedTime[0],
        };

        // Connect to the MongoDB database
        const mongoClient = await getConnectedClient();
        if (!mongoClient)
          throw new ResponseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorMessages.DatabaseConnectionFailed
          );

        const databaseName = process.env.MONGODB_DATABASE;
        const collection = process.env.MONGODB_USERS_COLLECTION!;
        const users = mongoClient.db(databaseName).collection(collection);

        // Find the existing user in the database
        const existingUser = await users.findOne({ email: session.user.email });
        if (!existingUser) {
          throw new ResponseError(StatusCodes.NOT_FOUND, ErrorMessages.UserNotFound);
        }
        // Update the item for the existing user
        const updateResult = await users.updateOne(
          { email: session.user.email, "items.id": fields.editedItemID[0] },
          { $set: { "items.$": editedItem } }
        );
        if (!updateResult || updateResult.modifiedCount === 0) {
          throw new ResponseError(StatusCodes.INTERNAL_SERVER_ERROR, ErrorMessages.ItemEditFailed);
        }

        // Update the user's operations
        const usersOperationsCollectionName = process.env.MONGODB_USERS_OPERATIONS_COLLECTION!;
        const usersOperationsCollection = mongoClient
          .db(databaseName)
          .collection(usersOperationsCollectionName);

        // First, try to increment the counts for the existing date
        let operationsUpdateResult = await usersOperationsCollection.updateOne(
          { email: session.user.email, "operations.date": fields.currentDate[0] },
          {
            $inc: {
              "operations.$.item_additions": 0,
              "operations.$.item_edits": 1,
              "operations.$.item_deletions": 0,
            },
          }
        );

        // If the date doesn't exist yet, push a new operation to the array
        if (operationsUpdateResult.matchedCount === 0) {
          const newOperationData: UserOperationsData = {
            date: fields.currentDate[0],
            item_additions: 0,
            item_edits: 1,
            item_deletions: 0,
          };
          operationsUpdateResult = await usersOperationsCollection.updateOne(
            { email: session.user.email },
            { $push: { operations: newOperationData } },
            { upsert: true }
          );
        }

        if (operationsUpdateResult.upsertedCount < 1 && operationsUpdateResult.modifiedCount < 1) {
          throw new ResponseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorMessages.UserOperationsUpdateFailed
          );
        }

        // update user inventory stats
        const usersInventoryStatsCollectionName =
          process.env.MONGODB_USERS_INVENTORY_STATS_COLLECTION!;
        const usersInventoryStatsCollection = mongoClient
          .db(databaseName)
          .collection(usersInventoryStatsCollectionName);

        const newTotalUserItemsChange: UserInventoryStat = {
          date: fields.currentDate[0],
          time: fields.currentTime[0],
          value: parseFloat(fields.newTotalUserItems[0]),
        };
        const newTotalUserItemsPriceChange: UserInventoryStat = {
          date: fields.currentDate[0],
          time: fields.currentTime[0],
          value: parseFloat(fields.newTotalUserItemsPrice[0]),
        };
        const newTotalUserItemAmountChange: UserInventoryStat = {
          date: fields.currentDate[0],
          time: fields.currentTime[0],
          value: parseFloat(fields.newTotalUserItemsAmount[0]),
        };
        const inventoryStatsUpdateResult = await usersInventoryStatsCollection.updateOne(
          { email: session.user.email },
          {
            $push: {
              total_items_history: newTotalUserItemsChange,
              total_items_price_history: newTotalUserItemsPriceChange,
              total_items_amount_history: newTotalUserItemAmountChange,
            },
          },
          { upsert: true }
        );

        if (
          inventoryStatsUpdateResult.upsertedCount < 1 &&
          inventoryStatsUpdateResult.modifiedCount < 1
        ) {
          throw new ResponseError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ErrorMessages.UserInventoryStatsUpdateFailed
          );
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
