import { NotificationContextType } from "@/lib/types/notification";
import { motion } from "framer-motion";
import { BiError } from "react-icons/bi";
import { IoMdDoneAll } from "react-icons/io";

function NotificationToast({ notification, hideNotification }: NotificationContextType) {
  const { type, message } = notification!;

  let statusClasses = "";

  if (type === "error") {
    statusClasses = "notificationToastError";
  }

  if (type === "loading" || type === "saving") {
    statusClasses = "notificationToastLoading";
  }
  
  return (
    <motion.section
      className={"notificationToastSectionBox"}
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
      <motion.div
        className={`${"notificationToastBox"} ${statusClasses}`}
        onClick={hideNotification}
      >
        {(type === "saving" || type === "loading") && (
          <motion.div
            key="loader"
            className={"notificationToastLoaderCircle"}
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
            className={"notificationToastIconTypeBox"}
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
            className={"notificationToastIconTypeBox"}
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
