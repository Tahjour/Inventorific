// components\layout\app\main-bar.js
import Loader from "@/components/ui/loading/loader";
import { useUserInfoContext } from "@/context/user-context";
import ListBar from "./list-bar/list-bar";
import MainBarMenu from "./main-bar-menu/main-bar-menu";
import styles from "./main-bar.module.css";

function MainBar() {
  const { serverLoadWasTried } = useUserInfoContext();

  return (
    <section className={styles.mainBar}>
      {!serverLoadWasTried && <Loader message={"Loading inventory..."} />}
      <MainBarMenu />
      <ListBar />
    </section>
  );
}

export default MainBar;
