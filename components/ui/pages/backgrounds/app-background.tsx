// components\ui\home-background.js
import { PropsWithChildren } from "react";
import styles from "./app-background.module.css";
export default function AppBackground(props: PropsWithChildren) {
  return <section className={styles.homeBackground}>{props.children}</section>;
}
