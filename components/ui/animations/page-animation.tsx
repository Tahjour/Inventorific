// components\ui\animations\page-animation.tsx
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
export default function PageAnimation({ children }: PropsWithChildren) {
  return (
    <motion.section
      initial="start"
      animate="end"
      exit="exit"
      variants={{
        start: { opacity: 0 },
        end: { opacity: 1 },
        exit: { opacity: 0 },
      }}
      transition={{
        duration: 0.2,
      }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.section>
  );
}
