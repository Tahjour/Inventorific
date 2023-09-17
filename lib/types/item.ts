// lib\types\item.ts

import { UserInfo } from "./user";

export type ItemsContextType = {
  itemModalIsOpen: boolean;
  deleteModalIsOpen: boolean;
  getItemToEdit: () => Item;
  getItemToDelete: () => Item;
  addItem: (newItem: Item) => Promise<void>;
  deleteItem: () => Promise<void>;
  saveEditedItem: (editedItem: Item) => Promise<void>;
  showItemModal: (itemToEdit: Item) => void;
  closeItemModal: () => void;
  showDeleteModal: (itemToDelete: Item, userInfoToDelete: UserInfo) => void;
  closeDeleteModal: () => void;
};

export type Item = {
  id: string;
  name: string;
  price: number;
  amount: number;
  description: string;
  date_created: string;
  time_created: string;
  date_modified: string;
  time_modified: string;
  imageURL: string;
  imageFile: File | undefined;
} | null;

export type MongodbItem = {
  id: string;
  name: string;
  price: number;
  amount: number;
  description: string;
  date_created: string;
  time_created: string;
  date_modified: string;
  time_modified: string;
  imageURL: string;
};

//api---------------------------------

export type ItemResponseData = {
  type: "success" | "error";
  message: string;
  uploadedItem?: MongodbItem;
  editedItem?: MongodbItem;
};
