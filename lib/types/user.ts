import { Dispatch, SetStateAction } from "react";
import { LoginValues, RegisterValues } from "./form-authentication";
import { Item } from "./item";
import { ListType } from "./list";

export type UserInfo = {
  login_type: "oauth" | "credentials";
  name: string;
  email: string;
  image: string;
  items: Item[];
  date_created: string;
  time_created: string;
  preferred_list_type?: ListType;
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
  loginUserWithGoogle: () => Promise<void>;
  registerUser: (values: RegisterValues) => Promise<void>;
  itemSearchTerm: string;
  setItemSearchTerm: Dispatch<SetStateAction<string>>;
  changePreferredListType: (listType: ListType) => void;
  getPreferredListType: () => ListType;
  // searchItems: (newItemSearchTerm: string) => void;
};

//api---------------------------------
export type UserResponseData = {
  type: "success" | "error";
  message: string;
  userInfo?: UserInfo;
};
