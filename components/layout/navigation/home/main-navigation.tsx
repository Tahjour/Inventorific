// components\layout\navigation\main-navigation.tsx
import Image from "next/image";
import Link from "next/link";
import MainDropDownMenu from "../../app/inventory/drop-down-menu/main-dropdown-menu";

export default function MainNavigation() {
  return (
    <header className={"header"}>
      <Link className={"logoLink"} href="/">
        <Image
          className={"logoImage"}
          src={"/Logo smaller.png"}
          alt={"The app's logo"}
          width={55}
          height={50}
          priority
        ></Image>
      </Link>

      <MainDropDownMenu />
    </header>
  );
}
