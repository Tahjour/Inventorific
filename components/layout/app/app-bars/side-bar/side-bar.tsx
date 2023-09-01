import { PropsWithChildren } from "react";
import styles from "./app-layout.module.css";

export default function SideBar({ children }: PropsWithChildren) {
  return <section className={styles.sideBar}>{children}</section>;
}
