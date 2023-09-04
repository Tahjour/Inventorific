// context\items-context.tsx
import { ErrorMessages, SuccessMessages } from "@/lib/helpers/messages";
import { ResponseData } from "@/lib/types/api";
import { Item, ItemsContextType } from "@/lib/types/item";
import { ListType } from "@/lib/types/list";
import { UserInfo } from "@/lib/types/user";
import { useSession } from "next-auth/react";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useNotification } from "./notification-context";
import { useUserInfoContext } from "./user-context";

const ItemsContext = createContext<ItemsContextType>({} as ItemsContextType);

export function ItemsContextProvider(props: PropsWithChildren) {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const { setUserInfoToDelete, setUserItems } = useUserInfoContext();
  const [itemToEdit, setItemToEdit] = useState<Item>(null);
  const [itemToDelete, setItemToDelete] = useState<Item>(null);
  const [itemModalIsOpen, setItemModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  function showItemModal(itemToEdit: Item) {
    setItemToEdit(itemToEdit);
    setItemModalIsOpen(true);
  }

  function showDeleteModal(itemToDelete: Item, userInfoToDelete: UserInfo) {
    setItemToDelete(itemToDelete);
    setUserInfoToDelete(userInfoToDelete);
    setDeleteModalIsOpen(true);
  }

  function closeItemModal() {
    setItemModalIsOpen(false);
  }

  function closeDeleteModal() {
    setDeleteModalIsOpen(false);
  }

  function getItemToEdit() {
    return itemToEdit;
  }

  function getItemToDelete() {
    return itemToDelete;
  }


  async function addItem(newItem: Item) {
    /**
     * Adds a new item to the user's list of items.
     *
     * @param newItem - The new item to be added.
     * @returns None.
     */
    try {
      if (!newItem) {
        throw new Error(ErrorMessages.NoItemToCreate);
      }

      setUserItems((prevItems) => {
        return [...prevItems, newItem];
      });

      if (!session) {
        showNotification({
          type: "success",
          message: SuccessMessages.ItemAdded,
        });
        return;
      }

      const formData = new FormData();

      formData.append("newItemID", newItem.id);
      formData.append("newItemName", newItem.name);
      formData.append("newItemPrice", newItem.price);
      formData.append("newItemAmount", newItem.amount);
      formData.append("newItemDescription", newItem.description);
      formData.append("newItemCreatedDate", newItem.date_created);
      formData.append("newItemCreatedTime", newItem.time_created);
      formData.append("newItemModifiedDate", newItem.date_modified);
      formData.append("newItemModifiedTime", newItem.time_modified);
      //Not important to send over imageURL for new item. Only the imageFile needs to be sent
      //The imageURL will be a temporary Blob URL at first and the imageFile will be sent to cloudinary
      // The ImageURL will be a permanent URL from cloudinary when the image is uploaded
      // formData.append("newItemImageURL", newItem.imageURL);
      if (newItem.imageFile) {
        formData.append("newItemImageFile", newItem.imageFile);
      }

      const response = await fetch("/api/add-item", { method: "POST", body: formData });

      const data: ResponseData = await response.json();
      if (data.type === "error" || !data.uploadedItem) {
        throw new Error(data.message);
      }
      newItem.imageURL = data.uploadedItem.imageURL;
      setUserItems((prevItems) => {
        return prevItems.map((item) => {
          return item?.id === newItem.id ? newItem : item;
        });
      });
      showNotification({
        type: "success",
        message: SuccessMessages.ItemAdded,
      });
    } catch (error) {
      showNotification({
        type: "error",
        message: error instanceof Error ? error.message : ErrorMessages.ItemCreationFailed,
      });
    }
  }

  async function saveEditedItem(editedItem: Item) {
    try {
      if (!itemToEdit || !editedItem) {
        throw new Error(ErrorMessages.NoItemToEdit);
      }
      setUserItems((prevItems) => {
        return prevItems.map((item) => (item?.id === editedItem.id ? editedItem : item));
      });

      if (!session) {
        showNotification({
          type: "success",
          message: SuccessMessages.ItemEdited,
        });
        return;
      }

      const formData = new FormData();
      //Add itemToEdit properties to form data
      formData.append("itemToEditID", itemToEdit.id);
      formData.append("itemToEditName", itemToEdit.name);
      formData.append("itemToEditPrice", itemToEdit.price);
      formData.append("itemToEditAmount", itemToEdit.amount);
      formData.append("itemToEditDescription", itemToEdit.description);
      formData.append("itemToEditCreatedDate", itemToEdit.date_created);
      formData.append("itemToEditCreatedTime", itemToEdit.time_created);
      formData.append("itemToEditModifiedDate", itemToEdit.date_modified);
      formData.append("itemToEditModifiedTime", itemToEdit.time_modified);
      formData.append("itemToEditImageURL", itemToEdit.imageURL);
      if (itemToEdit.imageFile) {
        formData.append("itemToEditImageFile", itemToEdit.imageFile);
      }

      // Add item after edit properties to form data
      formData.append("editedItemID", editedItem.id);
      formData.append("editedItemName", editedItem.name);
      formData.append("editedItemPrice", editedItem.price);
      formData.append("editedItemAmount", editedItem.amount);
      formData.append("editedItemDescription", editedItem.description);
      formData.append("editedItemCreatedDate", editedItem.date_created);
      formData.append("editedItemCreatedTime", editedItem.time_created);
      formData.append("editedItemModifiedDate", editedItem.date_modified);
      formData.append("editedItemModifiedTime", editedItem.time_modified);
      formData.append("editedItemImageURL", editedItem.imageURL);
      if (editedItem.imageFile) {
        formData.append("editedItemImageFile", editedItem.imageFile);
      }

      const response = await fetch("/api/edit-item", { method: "POST", body: formData });

      const data: ResponseData = await response.json();
      if (data.type === "error" || !data.editedItem) {
        throw new Error(data.message);
      }

      editedItem.imageURL = data.editedItem.imageURL;
      setUserItems((prevItems) => {
        return prevItems.map((item) => (item?.id === editedItem.id ? editedItem : item));
      });

      showNotification({
        type: "success",
        message: SuccessMessages.ItemEdited,
      });
    } catch (error) {
      showNotification({
        type: "error",
        message: error instanceof Error ? error.message : ErrorMessages.ItemEditFailed,
      });
    } finally {
      setItemToEdit(null);
    }
  }

  async function deleteItem() {
    try {
      if (!itemToDelete) {
        throw new Error(ErrorMessages.NoItemToDelete);
      }
      setUserItems((prevItems) => {
        return prevItems.filter((item) => item?.id !== itemToDelete.id);
      });
      if (!session) {
        showNotification({
          type: "success",
          message: SuccessMessages.ItemDeleted,
        });
        return;
      }
      const formData = new FormData();
      formData.append("itemToDeleteID", itemToDelete.id);
      formData.append("itemToDeleteName", itemToDelete.name);
      formData.append("itemToDeleteImageURL", itemToDelete.imageURL);
      const response = await fetch("/api/delete-item", { method: "POST", body: formData });
      const data: ResponseData = await response.json();
      if (data.type === "error") {
        throw new Error(data.message);
      }
      showNotification({
        type: "success",
        message: SuccessMessages.ItemDeleted,
      });
    } catch (error) {
      showNotification({
        type: "error",
        message: error instanceof Error ? error.message : ErrorMessages.ItemDeleteFailed,
      });
    } finally {
      setUserInfoToDelete(null);
    }
  }

  const context: ItemsContextType = {
    itemModalIsOpen,
    deleteModalIsOpen,
    getItemToEdit,
    getItemToDelete,
    addItem,
    saveEditedItem,
    deleteItem,
    showItemModal,
    closeItemModal,
    showDeleteModal,
    closeDeleteModal,
  };

  return <ItemsContext.Provider value={context}>{props.children}</ItemsContext.Provider>;
}

// Custom hook to quickly read the context's value
export const useItemsContext = (): ItemsContextType => {
  return useContext(ItemsContext);
};
