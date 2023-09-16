import { MainLoaderProps } from "@/lib/types/client-loading";
import { motion } from "framer-motion";
import { OpacityFadeFast } from "../animations/motion-props/form-transition-props";

export default function MainLoader({ message }: MainLoaderProps) {
  return (
    <motion.div className={"mainLoaderBox"} {...OpacityFadeFast}>
      <motion.div
        className={"mainLoaderCircle"}
        animate={{ scale: [1, 0.8, 1], rotate: [0, 360] }}
        transition={{
          scale: { duration: 1, repeat: Infinity, repeatType: "loop", ease: "easeInOut" },
          rotate: { duration: 0.5, repeat: Infinity, ease: "linear" },
        }}
      ></motion.div>
      {message}
    </motion.div>
  );
}
