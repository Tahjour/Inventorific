// context\notification-context.ts
import { NotificationContextType, NotificationType } from "@/lib/types/notification";
import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

export function NotificationContextProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<NotificationType>(null);

  useEffect(() => {
    if (notification && notification.type === "success") {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
    // if (notification && notification.type === "error") {
    //   const timer = setTimeout(() => {
    //     setNotification(null);
    //   }, 5000);
    //   return () => {
    //     clearTimeout(timer);
    //   };
    // }
  }, [notification]);

  function showNotification(notification: NotificationType) {
    setNotification(notification);
  }

  function hideNotification() {
    showNotification(null);
  }

  const context: NotificationContextType = {
    notification,
    showNotification,
    hideNotification,
  };

  return <NotificationContext.Provider value={context}>{children}</NotificationContext.Provider>;
}

// Custom hook to quickly read the context's value
export const useNotification = (): NotificationContextType => {
  return useContext(NotificationContext);
};
