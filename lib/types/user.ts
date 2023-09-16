import { Document, WithId } from "mongodb";
import { Dispatch, SetStateAction } from "react";
import { LoginValues, RegisterValues } from "./form-authentication";
import { Item } from "./item";
import { ListType } from "./list";
import { UserInventoryStats } from "./stats";

export type UserInfo = {
  login_type: "oauth" | "credentials";
  name: string;
  email: string;
  image: string;
  items: Item[];
  date_created: string;
  time_created: string;
  preferred_list_type?: ListType;
  user_operations?: DocumentOrUserOperationsData[];
} | null;

export type UserOperationType = "item_additions" | "item_edits" | "item_deletions";
export const UserOperationsLabelsList: UserOperationType[] = [
  "item_additions",
  "item_edits",
  "item_deletions",
];

export type UserOperationsData = {
  date: string;
  item_additions: number;
  item_deletions: number;
  item_edits: number;
};

export type DocumentOrUserOperationsData = WithId<Document> | UserOperationsData;

export type UserContextType = {
  getUserInfo: () => UserInfo;
  getUserInventoryStats: () => UserInventoryStats;
  setUserInventoryStats: Dispatch<SetStateAction<UserInventoryStats>>;
  getUserOperations: () => DocumentOrUserOperationsData[];
  setUserOperations: Dispatch<SetStateAction<DocumentOrUserOperationsData[]>>;
  getTotalForEachUserOperationList: () => number[];
  getUserItems: () => Item[];
  getUserItem: (itemID: string) => Item | undefined;
  setUserItems: Dispatch<SetStateAction<Item[]>>;
  getTotalUserItemsPrice: () => number;
  getTotalUserItemsAmount: () => number;
  getUserInfoToDelete: () => UserInfo;
  setUserInfoToDelete: Dispatch<SetStateAction<UserInfo>>;
  deleteUserInfo: () => Promise<void>;
  serverLoadWasTried: boolean;
  setServerLoadWasTried: Dispatch<SetStateAction<boolean>>;
  serverItemsWereLoaded: boolean;
  setServerItemsWereLoaded: Dispatch<SetStateAction<boolean>>;
  loginUser: (values: LoginValues) => Promise<void>;
  logoutUser: () => Promise<void>;
  loginUserWithGoogle: () => Promise<void>;
  registerUser: (values: RegisterValues) => Promise<void>;
  itemSearchTerm: string;
  setItemSearchTerm: Dispatch<SetStateAction<string>>;
  changePreferredListType: (listType: ListType) => Promise<void>;
  getPreferredListType: () => ListType;
  // searchItems: (newItemSearchTerm: string) => void;
};

//api---------------------------------
export type UserResponseData = {
  type: "success" | "error";
  message: string;
  userInfo?: UserInfo;
};
