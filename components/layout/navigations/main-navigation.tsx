import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { FiBox } from "react-icons/fi";
import { RiDashboard2Line } from "react-icons/ri";
import DropDownMenu from "../app/drop-down-menu/dropdownmenu";

export default function MainNavigation() {
  const router = useRouter();
  return (
    <header className={"header"}>
      <Link href="/">
        <Image
          className={"logoImage"}
          src={"/Logo smaller.png"}
          alt={"The app's logo"}
          width={55}
          height={50}
          priority
        ></Image>
      </Link>

      <div className={"appNavigationBox"}>
        {(router.pathname === "/inventory" || router.pathname === "/dashboard") && (
          <Fragment>
            <Link href={"/inventory"} className="appNavLink">
              <RiDashboard2Line size={25} />
              Dashboard
            </Link>
            <Link
              href={"/inventory"}
              className={`appNavLink ${router.pathname === "/inventory" ? "appNavLinkActive" : ""}`}
            >
              <FiBox size={25} />
              Inventory
            </Link>
          </Fragment>
        )}
      </div>

      <DropDownMenu />
    </header>
  );
}
