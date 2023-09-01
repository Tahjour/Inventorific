import { motion } from "framer-motion";
import { useItemsContext } from "../../context/items-context";
import { ModalBackdropMotion } from "../ui/animations/reusable-motion-props/form-transition-props";
import styles from "./modal-form.module.css";
function ModalBackdrop() {
  const { itemModalIsOpen, deleteModalIsOpen, closeItemModal, closeDeleteModal } =
    useItemsContext();
  function handleModalClose() {
    if (itemModalIsOpen) {
      closeItemModal();
    }
    if (deleteModalIsOpen) {
      closeDeleteModal();
    }
  }
  return (
    <motion.div
      className={styles.modalBackdrop}
      onClick={handleModalClose}
      {...ModalBackdropMotion}
    ></motion.div>
  );
}
export default ModalBackdrop;
