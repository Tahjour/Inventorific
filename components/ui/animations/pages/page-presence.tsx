// components\ui\animations\page-animation.tsx
import { AnimatePresence } from "framer-motion";
import { PropsWithChildren } from "react";
import PageAnimation from "./page-animation";
export default function PagePresence({ children }: PropsWithChildren) {
  return (
    <AnimatePresence>
      <PageAnimation>{children}</PageAnimation>
    </AnimatePresence>
  );
}
