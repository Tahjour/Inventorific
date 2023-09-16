import ListBar from "./list-bar/list-bar";
import MainBarMenu from "./main-bar-menu/main-bar-menu";

export default function MainBar() {
  return (
    <section className={"mainBarSectionBox"}>
      <MainBarMenu />
      <ListBar />
    </section>
  );
}
