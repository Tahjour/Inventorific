import { MongodbItem } from "./item";
import { UserInfo } from "./user";

export type ResponseData = {
  type: "success" | "error";
  message: string;
  uploadedItem?: MongodbItem;
  editedItem?: MongodbItem;
  userInfo?: UserInfo;
};
