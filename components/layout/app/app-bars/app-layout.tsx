// components\layout\app\app-layout.js
import { AnimatePresence } from "framer-motion";
import { Fragment, PropsWithChildren } from "react";
import { useItemsContext } from "../../../../context/items-context";
import AddItemModalForm from "../../../modals/add-item-modal-form";
import ModalBackdrop from "../../../modals/modal-form-backdrop";
import MainNavigation from "../../navigations/main-navigation";
import styles from "./app-layout.module.css";
import MainBar from "./main-bar/main-bar";

function AppLayout(props: PropsWithChildren) {
  const { itemModalIsOpen } = useItemsContext();
  return (
    <Fragment>
      <MainNavigation />

      <AnimatePresence mode="wait">
        {itemModalIsOpen && (
          <Fragment>
            <ModalBackdrop />
            <AddItemModalForm key="add-item-modal-form" />
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

export default AppLayout;
