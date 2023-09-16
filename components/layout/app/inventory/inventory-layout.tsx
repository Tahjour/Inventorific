// components\layout\app\app-layout.js
import AppNavigation from "@/components/layout/navigation/app/app-navigation";
import ItemModalForm from "@/components/modals/add-item-modal-form";
import ModalBackdrop from "@/components/modals/modal-form-backdrop";
import MainLoader from "@/components/ui/loading/main-loader";
import { useItemsContext } from "@/context/items-context";
import { useUserInfoContext } from "@/context/user-context";
import { PendingMessages } from "@/lib/helpers/messages";
import { AnimatePresence } from "framer-motion";
import { Fragment } from "react";
import MainBar from "./app-bars/main-bar/main-bar";

export default function InventoryLayout() {
  const { itemModalIsOpen } = useItemsContext();
  const { serverLoadWasTried } = useUserInfoContext();

  return (
    <section className="inventoryLayoutSectionBox">
      <AnimatePresence mode="wait">
        {itemModalIsOpen && (
          <Fragment>
            <ModalBackdrop />
            <ItemModalForm key="item-modal-form" />
          </Fragment>
        )}
      </AnimatePresence>
      {!serverLoadWasTried && <MainLoader message={PendingMessages.LoadingInventory} />}
      <AppNavigation />
      <MainBar />
    </section>
  );
}
