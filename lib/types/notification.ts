export type NotificationType = {
  type: "success" | "error" | "loading" | "saving";
  message: string;
} | null;

export type NotificationContextType = {
  notification: NotificationType;
  showNotification: (notification: NotificationType) => void;
  hideNotification: () => void;
};
