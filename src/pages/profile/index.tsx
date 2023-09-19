// pages\profile\index.js
import ProfilePageLayout from "@/components/auth-pages/profile-page";
import MainLoader from "@/components/ui/loading/main-loader";
import { useUserInfoContext } from "@/context/user-context";
import { AnimatePresence } from "framer-motion";
import { Fragment } from "react";

export default function ProfilePage() {
  const { serverLoadWasTried } = useUserInfoContext();
  return (
    <Fragment>
      <AnimatePresence mode="wait">
        {!serverLoadWasTried && <MainLoader message="Loading profile..." />}
      </AnimatePresence>
      {serverLoadWasTried && <ProfilePageLayout />}
    </Fragment>
  );
}
