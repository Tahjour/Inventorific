// pages\profile\index.js
import ProfilePageLayout from "@/components/auth-pages/profile-page";
import Loader from "@/components/ui/loading/loader";
import { useUserInfoContext } from "@/context/user-context";
import { AnimatePresence } from "framer-motion";
import { Fragment } from "react";

export default function ProfilePage() {
  const { getUserInfo } = useUserInfoContext();
  const userInfo = getUserInfo();
  return (
    <Fragment>
      <AnimatePresence mode="wait">
        {!userInfo && <Loader message="Loading profile..." />}
      </AnimatePresence>
      {userInfo && <ProfilePageLayout userInfo={userInfo} />}
    </Fragment>
  );
}
