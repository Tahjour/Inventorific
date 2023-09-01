// pages\index.js
import HomePageContent from "@/components/home-page/home-page-content";
import MainNavigation from "@/components/layout/navigations/main-navigation";
import { Fragment } from "react";

export default function HomePage() {
  return (
    <Fragment>
      <MainNavigation />
      <HomePageContent />
    </Fragment>
  );
}
