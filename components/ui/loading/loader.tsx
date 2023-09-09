import { LoaderProps } from "@/lib/types/client-loading";
import { motion } from "framer-motion";
import styles from "./loader.module.css";
import { OpacityMotionFast } from "../animations/motion-props/form-transition-props";

export default function Loader({ message }: LoaderProps) {
  return (
    <motion.div
      className={styles.wrapper}
      {...OpacityMotionFast}
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
