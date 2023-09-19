// components\auth-pages\profile-page.js
import { useUserInfoContext } from "@/context/user-context";
import { Fragment } from "react";
import { useItemsContext } from "../../context/items-context";
import MainDropDownMenu from "../layout/app/inventory/drop-down-menu/main-dropdown-menu";

export default function ProfilePageLayout() {
  const { showDeleteModal } = useItemsContext();
  const { getUserInfo, getUserItems } = useUserInfoContext();
  const userInfo = getUserInfo();
  const userItems = getUserItems();

  async function deleteUserHandler() {
    showDeleteModal(null, userInfo);
  }

  return (
    <Fragment>
      <section className="profileSectionBox">
        <div className="profileImageAndItemsBox">
          <div className="profileDropdownBox">
            <MainDropDownMenu />
          </div>
          <div className="profileUserInitialBox">{userInfo?.name[0]}</div>
          <h3>
            {userInfo?.login_type === "oauth" ? "Signed in with Google" : "Signed in with password"}
          </h3>
          <h3>
            {userItems?.length === 1
              ? `${userItems?.length} item`
              : `${userItems?.length} items`}
          </h3>
        </div>
        <div className="profileFormBox">
          <form>
            <div className="profileFormGroup">
              <label>Date joined</label>
              <input
                className="profileTextInput"
                type="text"
                defaultValue={userInfo?.date_created}
                disabled
              ></input>
            </div>
            {
              <div className="profileFormGroup">
                <label>Email Address</label>
                <input
                  className="profileTextInput"
                  type="email"
                  defaultValue={userInfo?.email}
                  disabled={userInfo?.login_type === "oauth" ? true : false}
                ></input>
              </div>
            }
            {
              <div className="profileFormGroup">
                <label>Username</label>
                <input
                  className="profileTextInput"
                  type="text"
                  defaultValue={userInfo?.name}
                  disabled={userInfo?.login_type === "oauth" ? true : false}
                ></input>
              </div>
            }

            <div className="profileButtons">
              {userInfo?.login_type === "credentials" && (
                <button className="profileUpdateInfoBtn" type="button">
                  Update Info
                </button>
              )}
              <button className="profileDeleteAccountBtn" type="button" onClick={deleteUserHandler}>
                Delete User
              </button>
            </div>
          </form>
        </div>
      </section>
    </Fragment>
  );
}
