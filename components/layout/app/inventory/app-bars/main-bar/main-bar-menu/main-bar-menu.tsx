// components\layout\app\app-bars\main-bar\main-bar-menu\main-bar-menu.tsx
import { useItemsContext } from "@/context/items-context";
import { useNotification } from "@/context/notification-context";
import { useUserInfoContext } from "@/context/user-context";
import { useWindowContext } from "@/context/window-context";
import { PendingMessages } from "@/lib/helpers/messages";
import { ResponseData } from "@/lib/types/api";
import { ListType } from "@/lib/types/list";
import { Fragment } from "react";
import { BsSearch } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";
import styles from "./main-bar-menu.module.css";

export default function MainBarMenu() {
  const { windowWidth } = useWindowContext();
  const { showItemModal } = useItemsContext();
  const { showNotification } = useNotification();
  const { itemSearchTerm, setItemSearchTerm, getPreferredListType, changePreferredListType } =
    useUserInfoContext();
  const listType = getPreferredListType();

  function addNewItemHandler() {
    showItemModal(null);
  }

  function handleSearchTermChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newItemSearchTerm = event.target.value;
    setItemSearchTerm(newItemSearchTerm);
  }

  // Updated changePreferredListTypeHandler to take a desired type
  async function changePreferredListTypeHandler(preferredListType: ListType) {
    showNotification({
      type: "saving",
      message: PendingMessages.Saving,
    });
    // Change the list type specifically to the desired type
    changePreferredListType(preferredListType);

    const response = await fetch("/api/save-preferred-list-type", {
      method: "POST",
      body: JSON.stringify({ preferredListType: preferredListType }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const data: ResponseData = await response.json();
    if (data.type === "error") {
      showNotification({
        type: "error",
        message: data.message,
      });
      return;
    }
    showNotification({
      type: "success",
      message: data.message,
    });
  }

  return (
    <Fragment>
      <section className={styles.mainBarMenuBox}>
        <div className={styles.mainBarMenu}>
          <div className={styles.searchBarBox}>
            <input
              className={styles.searchBar}
              type="text"
              placeholder="search..."
              onChange={handleSearchTermChange}
              value={itemSearchTerm}
            ></input>
            <BsSearch className={styles.searchIcon} />
          </div>
          <div className={styles.mainBarMenuBtnBox}>
            <div className={styles.mainBarMenuListTypeBtnBox}>
              <button
                className={`${styles.listTypeBtn} ${
                  listType === "slabs" && styles.activeListTypeBtn
                }`}
                onClick={() => changePreferredListTypeHandler("slabs")}
              >
                <FaListUl />
              </button>
              <button
                className={`${styles.listTypeBtn} ${
                  listType === "tiles" && styles.activeListTypeBtn
                }`}
                onClick={() => changePreferredListTypeHandler("tiles")}
              >
                <IoGrid />
              </button>
            </div>
            <button className={styles.mainBarMenuBtn} onClick={addNewItemHandler}>
              Add Item
            </button>
          </div>
        </div>
      </section>
    </Fragment>
  );
}
