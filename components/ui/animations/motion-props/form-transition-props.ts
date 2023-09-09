import { MotionProps } from "framer-motion";

export const OpacityMotionFast: MotionProps = {
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  variants: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  transition: {
    duration: 0.2,
  },
};

export const FormMotion: MotionProps = {
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  variants: {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
  },
  transition: {
    duration: 0.3,
  },
};
