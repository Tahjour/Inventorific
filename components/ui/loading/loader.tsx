import { LoaderProps } from "@/lib/types/client-loading";
import { motion } from "framer-motion";
import styles from "./loader.module.css";

export default function Loader({ message }: LoaderProps) {
  return (
    <motion.div
      className={styles.wrapper}
      initial="hidden"
      animate="visible"
      exit={"hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }}
    >
      <motion.div
        animate={{ scale: [1, 0.8, 1], rotate: [0, 360] }}
        transition={{
          scale: { duration: 1, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
          rotate: { duration: 0.5, repeat: Infinity, ease: "linear" },
        }}
        className={styles.loader}
      ></motion.div>
      {message}
    </motion.div>
  );
}
