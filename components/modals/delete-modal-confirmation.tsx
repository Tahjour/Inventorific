import { useItemsContext } from "@/context/items-context";
import { useNotification } from "@/context/notification-context";
import { useUserInfoContext } from "@/context/user-context";
import { PendingMessages } from "@/lib/helpers/messages";
import { motion } from "framer-motion";
import { AiOutlineWarning } from "react-icons/ai";
import { FormMotion } from "../ui/animations/motion-props/form-transition-props";

export default function DeleteConfirmation() {
  const { showNotification } = useNotification();
  const { getUserInfoToDelete, deleteUserInfo } = useUserInfoContext();
  const { getItemToDelete, deleteItem } = useItemsContext();
  const { closeDeleteModal } = useItemsContext();
  const itemToDelete = getItemToDelete();
  const userInfoToDelete = getUserInfoToDelete();

  async function deleteConfirmation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    closeDeleteModal();

    if (itemToDelete) {
      showNotification({
        type: "loading",
        message: PendingMessages.DeletingItem,
      });
      await deleteItem();
    }
    if (userInfoToDelete) {
      showNotification({
        type: "loading",
        message: PendingMessages.DeletingUser,
      });
      await deleteUserInfo();
    }
  }
  return (
    <section className={"modalFormSectionBox"}>
      <motion.form className={"modalFormDeleteForm"} onSubmit={deleteConfirmation} {...FormMotion}>
        <AiOutlineWarning size={100} color="red" />
        <h1>
          {userInfoToDelete
            ? "Deleting a user is permanent. Are you sure?"
            : "Are you sure you want to delete this item?"}
        </h1>
        <div className={"modalFormSubmitBtns"}>
          <button type="button" className={"modalFormCancelBtn"} onClick={closeDeleteModal}>
            Cancel
          </button>
          <button type="submit" className={"modalFormSubmitBtn"}>
            {"Delete"}
          </button>
        </div>
      </motion.form>
    </section>
  );
}
