import { ItemsContextProvider } from "@/context/items-context";
import { NotificationContextProvider } from "@/context/notification-context";
import { UserContextProvider } from "@/context/user-context";
import { PropsWithChildren } from "react";

export default function AllContextProviders(props: PropsWithChildren) {
    return (
        <NotificationContextProvider>
            <UserContextProvider>
                <ItemsContextProvider>{props.children}</ItemsContextProvider>
            </UserContextProvider>
        </NotificationContextProvider>
    );
}
