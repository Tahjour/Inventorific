// nextjs-inventory-control\components\layout\app\dropdownmenu.tsx
import { useUserInfoContext } from "@/context/user-context";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillCaretDown, AiOutlineUser, AiOutlineUserSwitch } from "react-icons/ai";
import { FaHome, FaUserCog } from "react-icons/fa";
import { MdLaunch } from "react-icons/md";
import { RiDashboard2Line, RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";

export default function MainDropDownMenu() {
  const { data: session } = useSession();
  const { logoutUser } = useUserInfoContext();
  const route = useRouter().route;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function logOutHandler() {
    await logoutUser();
  }

  return (
    <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenu.Trigger className={"mainDropDownMenuTrigger"}>
        <FaUserCog size={20} />

        <motion.div
          className={"mainDropDownMenuUserIconBox"}
          animate={{ rotate: dropdownOpen ? 180 : 0 }}
        >
          <AiFillCaretDown size={15} />
        </motion.div>
      </DropdownMenu.Trigger>
      <AnimatePresence>
        {dropdownOpen && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content className={"mainDropDownMenuContent"} asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {route !== "/" && (
                  <Link href={"/"} className={"mainDropDownMenuLink"}>
                    <DropdownMenu.Item className={"mainDropDownMenuItem"}>
                      <span className={"mainDropDownMenuIconWrapper"}>
                        <FaHome size={20} />
                      </span>
                      Home
                    </DropdownMenu.Item>
                  </Link>
                )}

                {session && route !== "/profile" && (
                  <Link href={"/profile"} className={"mainDropDownMenuLink"}>
                    <DropdownMenu.Item className={"mainDropDownMenuItem"}>
                      <span className={"mainDropDownMenuIconWrapper"}>
                        <AiOutlineUser size={20} />
                      </span>
                      Profile
                    </DropdownMenu.Item>
                  </Link>
                )}

                {!session && (
                  <Link href={"/login"} className={"mainDropDownMenuLink"}>
                    <DropdownMenu.Item className={"mainDropDownMenuItem"}>
                      <span className={"mainDropDownMenuIconWrapper"}>
                        <RiLoginBoxLine size={20} />
                      </span>
                      Login
                    </DropdownMenu.Item>
                  </Link>
                )}

                {route !== "dashboard" && (
                  <Link href={"/dashboard"} className={"mainDropDownMenuLink"}>
                    <DropdownMenu.Item className={"mainDropDownMenuItem"}>
                      <span className={"mainDropDownMenuIconWrapper"}>
                        <RiDashboard2Line size={20} />
                      </span>
                      Dashboard
                    </DropdownMenu.Item>
                  </Link>
                )}

                {route !== "/inventory" && (
                  <Link href={"/inventory"} className={"mainDropDownMenuLink"}>
                    <DropdownMenu.Item className={"mainDropDownMenuItem"}>
                      <span className={"mainDropDownMenuIconWrapper"}>
                        <MdLaunch size={20} />
                      </span>
                      Inventory
                    </DropdownMenu.Item>
                  </Link>
                )}

                {session && route !== "/login" && route !== "/register" && (
                  <Link href={"/login"} className={"mainDropDownMenuLink"}>
                    <DropdownMenu.Item className={"mainDropDownMenuItem"}>
                      <span className={"mainDropDownMenuIconWrapper"}>
                        <AiOutlineUserSwitch size={20} />
                      </span>
                      Switch User
                    </DropdownMenu.Item>
                  </Link>
                )}

                {session && (
                  <DropdownMenu.Item className={"mainDropDownMenuItem"} onClick={logOutHandler}>
                    <span className={"mainDropDownMenuIconWrapper"}>
                      <RiLogoutBoxLine size={20} />
                    </span>
                    Log Out
                  </DropdownMenu.Item>
                )}
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}
