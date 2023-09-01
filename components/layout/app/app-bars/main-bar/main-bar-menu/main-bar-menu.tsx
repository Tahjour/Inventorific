// components\layout\app\app-bars\main-bar\main-bar-menu\main-bar-menu.tsx
import { useItemsContext } from "@/context/items-context";
import { useUserInfoContext } from "@/context/user-context";
import { Fragment } from "react";
import { BsSearch } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";
import styles from "./main-bar-menu.module.css";

export default function MainBarMenu() {
  const { showItemModal } = useItemsContext();
  const { itemSearchTerm, setItemSearchTerm } = useUserInfoContext();

  function addNewItemHandler() {
    showItemModal(null);
  }

  function handleSearchTermChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newItemSearchTerm = event.target.value;
    setItemSearchTerm(newItemSearchTerm);
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
          <div className={styles.mainBarMenuBtns}>
            <div className={styles.mainBarMenuBtnIcons}>
              <button className={styles.listTypeBtn}>
                <FaListUl />
              </button>
              <button className={`${styles.listTypeBtn} ${styles.activeListTypeBtn}`}>
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
