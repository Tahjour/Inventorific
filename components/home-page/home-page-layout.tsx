import { Fragment, PropsWithChildren } from "react";
import MainNavigation from "../layout/navigation/home/home-navigation";

export default function HomePageLayout(props: PropsWithChildren) {
  return (
    <Fragment>
      <MainNavigation />
      {props.children}
    </Fragment>
  );
}
