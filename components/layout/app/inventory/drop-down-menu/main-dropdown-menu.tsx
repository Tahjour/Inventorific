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
import styles from "./main-dropdown-menu.module.css";

function MainDropDownMenu() {
  const { data: session } = useSession();
  const { logoutUser } = useUserInfoContext();
  const route = useRouter().route;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function logOutHandler() {
    await logoutUser();
  }

  return (
    <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenu.Trigger className={styles.dropdownTrigger}>
        <FaUserCog size={20} />

        <motion.div
          className={styles.dropdownUserIconBox}
          animate={{ rotate: dropdownOpen ? 180 : 0 }}
        >
          <AiFillCaretDown size={15} />
        </motion.div>
      </DropdownMenu.Trigger>
      <AnimatePresence>
        {dropdownOpen && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content className={styles.dropdownContent} asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {route !== "/" && (
                  <Link href={"/"} className={styles.dropdownLink}>
                    <DropdownMenu.Item className={styles.dropdownItem}>
                      <span className={styles.iconWrapper}>
                        <FaHome size={20} />
                      </span>
                      Home
                    </DropdownMenu.Item>
                  </Link>
                )}

                {session && route !== "/profile" && (
                  <Link href={"/profile"} className={styles.dropdownLink}>
                    <DropdownMenu.Item className={styles.dropdownItem}>
                      <span className={styles.iconWrapper}>
                        <AiOutlineUser size={20} />
                      </span>
                      Profile
                    </DropdownMenu.Item>
                  </Link>
                )}

                {!session && (
                  <Link href={"/login"} className={styles.dropdownLink}>
                    <DropdownMenu.Item className={styles.dropdownItem}>
                      <span className={styles.iconWrapper}>
                        <RiLoginBoxLine size={20} />
                      </span>
                      Login
                    </DropdownMenu.Item>
                  </Link>
                )}

                {route !== "dashboard" && (
                  <Link href={"/dashboard"} className={styles.dropdownLink}>
                    <DropdownMenu.Item className={styles.dropdownItem}>
                      <span className={styles.iconWrapper}>
                        <RiDashboard2Line size={20} />
                      </span>
                      Dashboard
                    </DropdownMenu.Item>
                  </Link>
                )}

                {route !== "/inventory" && (
                  <Link href={"/inventory"} className={styles.dropdownLink}>
                    <DropdownMenu.Item className={styles.dropdownItem}>
                      <span className={styles.iconWrapper}>
                        <MdLaunch size={20} />
                      </span>
                      Inventory
                    </DropdownMenu.Item>
                  </Link>
                )}

                {session && route !== "/login" && route !== "/register" && (
                  <Link href={"/login"} className={styles.dropdownLink}>
                    <DropdownMenu.Item className={styles.dropdownItem}>
                      <span className={styles.iconWrapper}>
                        <AiOutlineUserSwitch size={20} />
                      </span>
                      Switch User
                    </DropdownMenu.Item>
                  </Link>
                )}

                {session && (
                  <DropdownMenu.Item className={styles.dropdownItem} onClick={logOutHandler}>
                    <span className={styles.iconWrapper}>
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

export default MainDropDownMenu;
