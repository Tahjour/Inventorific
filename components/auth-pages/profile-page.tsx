// components\auth-pages\profile-page.js
import { UserInfo } from "@/lib/types/user";
import { Fragment } from "react";
import { useItemsContext } from "../../context/items-context";
import MainDropDownMenu from "../layout/app/drop-down-menu/dropdownmenu";
import styles from "./profile-page.module.css";

function ProfilePageLayout({ userInfo }: { userInfo: UserInfo }) {
  const { showDeleteModal } = useItemsContext();

  async function deleteUserHandler() {
    showDeleteModal(null, userInfo);
  }

  return (
    <Fragment>
      {/* <MainNavigation /> */}
      <section className={styles.profileBox}>
        <div className={styles.imageAndItemsBox}>
          <div className={styles.dropdownBox}>
            <MainDropDownMenu />
          </div>
          <div className={styles.userImage}>{userInfo?.name[0]}</div>
          <h3>
            {userInfo?.login_type === "oauth" ? "Signed in with Google" : "Signed in with password"}
          </h3>
          <h3>
            {userInfo?.items.length === 1
              ? `${userInfo?.items.length} item`
              : `${userInfo?.items.length} items`}
          </h3>
        </div>
        <div className={styles.formBox}>
          <form>
            <div className={styles.formGroup}>
              <label>Date joined</label>
              <input
                className={styles.textInput}
                type="text"
                defaultValue={userInfo?.date_created}
                disabled
              ></input>
            </div>
            {
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input
                  className={styles.textInput}
                  type="email"
                  defaultValue={userInfo?.email}
                  disabled={userInfo?.login_type === "oauth" ? true : false}
                ></input>
              </div>
            }
            {
              <div className={styles.formGroup}>
                <label>Username</label>
                <input
                  className={styles.textInput}
                  type="text"
                  defaultValue={userInfo?.name}
                  disabled={userInfo?.login_type === "oauth" ? true : false}
                ></input>
              </div>
            }

            <div className={styles.buttons}>
              {userInfo?.login_type === "credentials" && (
                <button className={styles.updateInfoBtn} type="button">
                  Update Info
                </button>
              )}
              <button className={styles.deleteAccountBtn} type="button" onClick={deleteUserHandler}>
                Delete User
              </button>
            </div>
          </form>
        </div>
      </section>
    </Fragment>
  );
}

export default ProfilePageLayout;
