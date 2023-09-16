// components\ui\animations\page-animation.tsx
import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import { OpacityFadeFast } from "../motion-props/form-transition-props";
export default function PageAnimation({ children }: PropsWithChildren) {
  return (
    <motion.section {...OpacityFadeFast} style={{ height: "100%" }}>
      {children}
    </motion.section>
  );
}
