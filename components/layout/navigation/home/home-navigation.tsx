// components\layout\navigation\main-navigation.tsx
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { FiBox } from "react-icons/fi";
import { RiDashboard2Line } from "react-icons/ri";
import DropDownMenu from "../../app/drop-down-menu/dropdownmenu";

export default function MainNavigation() {
  const router = useRouter();
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

      <DropDownMenu />
    </header>
  );
}
