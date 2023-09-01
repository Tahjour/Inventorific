import { Dispatch, SetStateAction } from "react";
import { LoginValues, RegisterValues } from "./form-authentication";
import { Item } from "./item";

export type UserInfo = {
  login_type: "oauth" | "credentials";
  name: string;
  email: string;
  image: string;
  items: Item[];
  date_created: string;
  time_created: string;
} | null;

export type UserContextType = {
  getUserInfo: () => UserInfo;
  getUserItems: () => Item[];
  getUserItem: (itemID: string) => Item | undefined;
  setUserItems: Dispatch<SetStateAction<Item[]>>;
  getUserInfoToDelete: () => UserInfo;
  setUserInfoToDelete: Dispatch<SetStateAction<UserInfo>>;
  deleteUserInfo: () => void;
  serverLoadWasTried: boolean;
  setServerLoadWasTried: Dispatch<SetStateAction<boolean>>;
  serverItemsWereLoaded: boolean;
  setServerItemsWereLoaded: Dispatch<SetStateAction<boolean>>;
  loginUser: (values: LoginValues) => Promise<void>;
  registerUser: (values: RegisterValues) => Promise<void>;
  itemSearchTerm: string;
  setItemSearchTerm: Dispatch<SetStateAction<string>>;
  // searchItems: (newItemSearchTerm: string) => void;
};

//api---------------------------------
export type UserResponseData = {
  type: "success" | "error";
  message: string;
  userInfo?: UserInfo;
};
