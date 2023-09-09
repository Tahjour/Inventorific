// pages\index.js
import HomePageContent from "@/components/home-page/home-page-content";
import MainNavigation from "@/components/layout/navigation/home/main-navigation";
import { Fragment } from "react";

export default function HomePage() {
  return (
    <Fragment>
      <MainNavigation />
      <HomePageContent />
    </Fragment>
  );
}