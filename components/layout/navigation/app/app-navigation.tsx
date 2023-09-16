// components\layout\navigation\main-navigation.tsx
import { useWindowContext } from "@/context/window-context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FiBox } from "react-icons/fi";
import { RiDashboard2Line } from "react-icons/ri";
import MainDropDownMenu from "../../app/inventory/drop-down-menu/main-dropdown-menu";

export default function AppNavigation() {
  const { windowWidth } = useWindowContext();
  const router = useRouter();
  return (
    <header className={"navigationHeader"}>
      <Link className={"navigationLogoLink"} href="/">
        <Image
          className={"navigationLogoImage"}
          src={"/Logo smaller.png"}
          alt={"The app's logo"}
          width={60}
          height={50}
          priority
        ></Image>
      </Link>

      {
        <div className={"appNavigationBox"}>
          <Link
            href={"/dashboard"}
            className={`appNavLink ${router.pathname === "/dashboard" && "appNavLinkActive"}`}
          >
            <RiDashboard2Line size={25} />
            {windowWidth > 480 && "Dashboard"}
          </Link>
          <Link
            href={"/inventory"}
            className={`appNavLink ${router.pathname === "/inventory" && "appNavLinkActive"}`}
          >
            <FiBox size={25} />
           {windowWidth > 480 && "Inventory"}
          </Link>
        </div>
      }

      <MainDropDownMenu />
    </header>
  );
}
