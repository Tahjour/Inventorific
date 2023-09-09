// components\layout\main-layout.tsx
import DeleteConfirmation from "@/components/modals/delete-modal-confirmation";
import ModalBackdrop from "@/components/modals/modal-form-backdrop";
import NotificationToast from "@/components/ui/notification/notification-popup";
import { useItemsContext } from "@/context/items-context";
import { useNotification } from "@/context/notification-context";
import { useWindowContext } from "@/context/window-context";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Fragment, PropsWithChildren } from "react";
import PageAnimation from "../ui/animations/pages/page-animation";
import styles from "./main-layout.module.css";

export default function MainLayout({ children }: PropsWithChildren) {
  const { windowHeight } = useWindowContext();
  const { deleteModalIsOpen } = useItemsContext();
  const notificationContext = useNotification();
  const router = useRouter();

  return (
    <section className={styles.mainLayoutBox} style={{ height: windowHeight }}>
      <AnimatePresence mode="wait">
        <PageAnimation key={router.pathname}>{children}</PageAnimation>
      </AnimatePresence>

      <AnimatePresence>
        {deleteModalIsOpen && (
          <Fragment>
            <ModalBackdrop />
            <DeleteConfirmation key="delete-modal-confirmation" />
          </Fragment>
        )}
        {notificationContext.notification && (
          <NotificationToast key="notification-popup" {...notificationContext} />
        )}
      </AnimatePresence>
    </section>
  );
}
