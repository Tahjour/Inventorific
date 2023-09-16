import { motion } from "framer-motion";
import { useItemsContext } from "../../context/items-context";
import { OpacityFadeFast } from "../ui/animations/motion-props/form-transition-props";
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
      className={"modalFormModalBackdrop"}
      onClick={handleModalClose}
      {...OpacityFadeFast}
    ></motion.div>
  );
}
export default ModalBackdrop;
