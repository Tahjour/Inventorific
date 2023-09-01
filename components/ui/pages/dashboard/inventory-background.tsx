// components\ui\home-background.js
import { PropsWithChildren } from "react";
import styles from "./inventory-background.module.css";
export default function InventoryBackground(props: PropsWithChildren) {
  return <section className={styles.homeBackground}>{props.children}</section>;
}
