import { NotificationContextType } from "@/lib/types/notification";
import { motion } from "framer-motion";
import { BiError } from "react-icons/bi";
import { IoMdDoneAll } from "react-icons/io";
import styles from "./notification-popup.module.css";

function NotificationToast({ notification, hideNotification }: NotificationContextType) {
  const { type, message } = notification!;

  let statusClasses = "";

  if (type === "success") {
    statusClasses = styles.success;
  }

  if (type === "error") {
    statusClasses = styles.error;
  }

  if (type === "loading" || type === "saving") {
    statusClasses = styles.loading;
  }

  const notificationToast = `${styles.notificationToast} ${statusClasses}`;

  return (
    <motion.section
      className={styles.notificationToastBox}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0, bottom: 0 },
        visible: { opacity: 1, bottom: 30 },
        exit: { opacity: 0, bottom: 0 },
      }}
      transition={{
        duration: 0.5,
      }}
    >
      <motion.div className={notificationToast} onClick={hideNotification}>
        {(type === "saving" || type === "loading") && (
          <motion.div
            key="loader"
            className={styles.notificationLoader}
            animate={{
              rotate: [0, 360],
              transition: {
                rotate: { duration: 0.3, repeat: Infinity, ease: "linear" },
              },
            }}
          ></motion.div>
        )}
        {type === "error" && (
          <motion.div
            className={styles.typeIconBox}
            key="icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <BiError size={25} />
          </motion.div>
        )}
        {type === "success" && (
          <motion.div
            className={styles.typeIconBox}
            key="icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <IoMdDoneAll size={25} />
          </motion.div>
        )}
        <p>{message}</p>
      </motion.div>
    </motion.section>
  );
}

export default NotificationToast;
