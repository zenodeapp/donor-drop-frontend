import { IconType } from "react-icons";

export type INotificationState = {
  limit: number;
  notifications: Array<INotification>;
};

export type INotificationMessage = string | React.ReactNode;
export type INotificationTypes =
  | "warning"
  | "error"
  | "success"
  | "loading"
  | "default"
  | "continue";

export type INotificationOptions = {
  id?: string;
  type?: INotificationTypes;
  duration?: number;
  Icon?: IconType;
  delay?: number;
  ghost?: boolean;
  antiGhost?: boolean;
  dismissable?: boolean;
  hideIcon?: boolean;
};

export type INotificationContext = INotificationState & {
  addNotification: (notification: INotification) => INotification;
  setNotifications: (
    notifications: Array<INotification>
  ) => Array<INotification>;
  notify: (
    notification: IPreNotification,
    delay?: number
  ) => Promise<NotificationResult>;
  dismiss: (
    notificationId: string,
    delay?: number,
    clicked?: boolean
  ) => Promise<boolean>;
  dismissAll: (clicked?: boolean) => Promise<boolean>;
};

export type IPreNotification = {
  type?: INotificationTypes;
  message: INotificationMessage;
  options?: INotificationOptions;
};

export type INotificationProvider = {
  options: {
    limit: number;
    success?: {
      duration?: number;
      Icon?: IconType;
    };
    DefaultIcon?: IconType;
    hideIcon?: boolean;
  };
  children: React.ReactNode;
};

export type INotification = {
  id: string;
  type: INotificationTypes;
  message: INotificationMessage;
  Icon?: IconType;
  duration: number;
  hide: boolean;
  forceHide: boolean;
  delay: number;
  ghost: boolean;
  antiGhost: boolean;
  dismissable: boolean;
  hideIcon?: boolean;
};

export enum NotificationActions {
  SET_NOTIFICATIONS = "SET_NOTIFICATIONS",
  ADD_NOTIFICATION = "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION",
  REMOVE_NOTIFICATIONS = "REMOVE_NOTIFICATIONS",
}

export enum NotificationResult {
  SUCCESS = "SUCCESS",
  SHOWN = "SHOWN",
  DISMISSED = "DISMISSED",
  INFINITY = "INFINITY",
  INTERRUPTED = "INTERRUPTED",
  FAILED = "FAILED",
}

export type INotificationActions =
  | {
      type: NotificationActions.SET_NOTIFICATIONS;
      payload: Array<INotification>;
    }
  | {
      type: NotificationActions.ADD_NOTIFICATION;
      payload: INotification;
    }
  | {
      type: NotificationActions.REMOVE_NOTIFICATION;
      payload?: { id?: string; clicked?: boolean };
    }
  | {
      type: NotificationActions.REMOVE_NOTIFICATIONS;
      payload: Array<string>;
    };
