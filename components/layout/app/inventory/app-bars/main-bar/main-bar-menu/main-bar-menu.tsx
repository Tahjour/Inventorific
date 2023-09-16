// components\layout\app\app-bars\main-bar\main-bar-menu\main-bar-menu.tsx
import { useItemsContext } from "@/context/items-context";
import { useNotification } from "@/context/notification-context";
import { useUserInfoContext } from "@/context/user-context";
import { useWindowContext } from "@/context/window-context";
import { ListType } from "@/lib/types/list";
import { Fragment } from "react";
import { BsSearch } from "react-icons/bs";
import { FaListUl } from "react-icons/fa";
import { IoGrid } from "react-icons/io5";

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
  async function changePreferredListTypeHandler(listType: ListType) {
    await changePreferredListType(listType);
  }

  return (
    <Fragment>
      <section className={"mainBarMenuSectionBox"}>
        <div className={"mainBarMenuBox"}>
          <div className={"mainBarMenuSearchBarBox"}>
            <input
              className={"mainBarMenuSearchInput"}
              type="text"
              placeholder="search..."
              onChange={handleSearchTermChange}
              value={itemSearchTerm}
            ></input>
            <BsSearch className={"mainBarMenuSearchIcon"} />
          </div>
          <div className={"mainBarMenuBtnBox"}>
            <div className={"mainBarMenuListTypeBtnBox"}>
              <button
                className={`${"mainBarMenuListTypeBtn"} ${
                  listType === "slabs" && "mainBarMenuActiveListTypeBtn"
                }`}
                onClick={() => changePreferredListTypeHandler("slabs")}
              >
                <FaListUl />
              </button>
              <button
                className={`${"mainBarMenuListTypeBtn"} ${
                  listType === "tiles" && "mainBarMenuActiveListTypeBtn"
                }`}
                onClick={() => changePreferredListTypeHandler("tiles")}
              >
                <IoGrid />
              </button>
            </div>
            <button className={"mainBarMenuBtn"} onClick={addNewItemHandler}>
              Add Item
            </button>
          </div>
        </div>
      </section>
    </Fragment>
  );
}
