import { motion } from "framer-motion";
import { useItemsContext } from "../../context/items-context";
import { OpacityMotionFast } from "../ui/animations/motion-props/form-transition-props";
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
      {...OpacityMotionFast}
    ></motion.div>
  );
}
export default ModalBackdrop;
