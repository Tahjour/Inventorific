// components\layout\app\app-layout.js
import AppNavigation from "@/components/layout/navigation/app/app-navigation";
import ItemModalForm from "@/components/modals/add-item-modal-form";
import ModalBackdrop from "@/components/modals/modal-form-backdrop";
import { useItemsContext } from "@/context/items-context";
import { AnimatePresence } from "framer-motion";
import { Fragment } from "react";
import styles from "./inventory-layout.module.css";
import MainBar from "./main-bar/main-bar";

export default function InventoryLayout() {
  const { itemModalIsOpen } = useItemsContext();
  return (
    <Fragment>
      <AppNavigation />
      <AnimatePresence mode="wait">
        {itemModalIsOpen && (
          <Fragment>
            <ModalBackdrop />
            <ItemModalForm key="item-modal-form" />
          </Fragment>
        )}
      </AnimatePresence>

      <div className={styles.bars}>
        {/* <SideBar /> */}
        <MainBar />
      </div>
    </Fragment>
  );
}
