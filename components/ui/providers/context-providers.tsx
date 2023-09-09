import { ItemsContextProvider } from "@/context/items-context";
import { NotificationContextProvider } from "@/context/notification-context";
import { UserContextProvider } from "@/context/user-context";
import { WindowContextProvider } from "@/context/window-context";
import { PropsWithChildren } from "react";

export default function AllContextProviders(props: PropsWithChildren) {
  return (
    <WindowContextProvider>
      <NotificationContextProvider>
        <UserContextProvider>
          <ItemsContextProvider>{props.children}</ItemsContextProvider>
        </UserContextProvider>
      </NotificationContextProvider>
    </WindowContextProvider>
  );
}
