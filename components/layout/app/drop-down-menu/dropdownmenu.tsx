// nextjs-inventory-control\components\layout\app\dropdownmenu.tsx
import { useNotification } from "@/context/notification-context";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { AiFillCaretDown, AiOutlineUser, AiOutlineUserSwitch } from "react-icons/ai";
import { FaHome, FaUserCog } from "react-icons/fa";
import { MdLaunch } from "react-icons/md";
import { RiLoginBoxLine, RiLogoutBoxLine } from "react-icons/ri";
import styles from "./dropdownmenu.module.css";

function DropDownMenu() {
  const { showNotification } = useNotification();
  const { data: session } = useSession();
  const route = useRouter().route;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  async function logOutHandler() {
    showNotification({
      type: "loading",
      message: "Signing out ...",
    });
    const res = await signOut();
    if (res) {
      console.log(res);
    }
  }

  const handleDropdownTriggerClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

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
                {route !== "/" ? (
                  <Link href={"/"} className={styles.dropdownLink}>
                    <DropdownMenu.Item className={styles.dropdownItem}>
                      <span className={styles.iconWrapper}>
                        <FaHome size={20} />
                      </span>
                      Home
                    </DropdownMenu.Item>
                  </Link>
                ) : null}

                {session && route !== "/profile" ? (
                  <Link href={"/profile"} className={styles.dropdownLink}>
                    <DropdownMenu.Item className={styles.dropdownItem}>
                      <span className={styles.iconWrapper}>
                        <AiOutlineUser size={20} />
                      </span>
                      Profile
                    </DropdownMenu.Item>
                  </Link>
                ) : null}

                {!session ? (
                  <Link href={"/login"} className={styles.dropdownLink}>
                    <DropdownMenu.Item className={styles.dropdownItem}>
                      <span className={styles.iconWrapper}>
                        <RiLoginBoxLine size={20} />
                      </span>
                      Login
                    </DropdownMenu.Item>
                  </Link>
                ) : null}

                {route !== "/inventory" ? (
                  <Link href={"/inventory"} className={styles.dropdownLink}>
                    <DropdownMenu.Item className={styles.dropdownItem}>
                      <span className={styles.iconWrapper}>
                        <MdLaunch size={20} />
                      </span>
                      Launch
                    </DropdownMenu.Item>
                  </Link>
                ) : null}

                {/* {session ? <Link href={"/register"} className={styles.dropdownLink}>
                    <DropdownMenu.Item className={styles.dropdownItem}>
                        Make New Account
                    </DropdownMenu.Item>
                </Link> : null} */}

                {session && route !== "/login" && route !== "/register" ? (
                  <Link href={"/login"} className={styles.dropdownLink}>
                    <DropdownMenu.Item className={styles.dropdownItem}>
                      <span className={styles.iconWrapper}>
                        <AiOutlineUserSwitch size={20} />
                      </span>
                      Switch User
                    </DropdownMenu.Item>
                  </Link>
                ) : null}

                {session ? (
                  <DropdownMenu.Item className={styles.dropdownItem} onClick={logOutHandler}>
                    <span className={styles.iconWrapper}>
                      <RiLogoutBoxLine size={20} />
                    </span>
                    Log Out
                  </DropdownMenu.Item>
                ) : null}
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  );
}

export default DropDownMenu;
