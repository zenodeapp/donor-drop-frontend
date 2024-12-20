import React from "react";
import {
  INotification,
  INotificationActions,
  INotificationOptions,
  INotificationState,
  NotificationActions,
} from "./NotificationTypes";

const NotificationDispatch = (
  dispatch: React.Dispatch<INotificationActions>
) => {
  return {
    setNotifications: (notifications: Array<INotification>) => {
      dispatch({
        type: NotificationActions.SET_NOTIFICATIONS,
        payload: notifications,
      });

      return notifications;
    },
    addNotification: (notification: INotification) => {
      dispatch({
        type: NotificationActions.ADD_NOTIFICATION,
        payload: notification,
      });

      return notification;
    },
    removeNotification: (id?: string, clicked?: boolean) => {
      dispatch({
        type: NotificationActions.REMOVE_NOTIFICATION,
        payload: { id, clicked },
      });
    },
    removeNotifications: (ids: Array<string>) => {
      dispatch({
        type: NotificationActions.REMOVE_NOTIFICATIONS,
        payload: ids,
      });
    },
  };
};

const NotificationReducer = (
  state: INotificationState,
  action: INotificationActions
): INotificationState => {
  switch (action.type) {
    case NotificationActions.ADD_NOTIFICATION:
      const existing = state.notifications.find(
        (notification) => notification.id === action.payload.id
      );

      return {
        ...state,
        notifications: existing
          ? state.notifications
              .map((notification) =>
                notification.id === action.payload.id
                  ? { ...notification, ...action.payload }
                  : notification
              )
              .filter(
                (notification) =>
                  !(notification.hide && notification.delay === 0)
              )
          : [action.payload, ...state.notifications].slice(0, state.limit),
      };
    case NotificationActions.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
      };
    case NotificationActions.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map((notification) => {
          if (
            !(action.payload?.clicked && !notification.dismissable) &&
            (action.payload?.id === undefined ||
              notification.id === action.payload.id)
          ) {
            notification.hide = true;
            notification.forceHide = false;
            notification.delay = 0;
          }
          return notification;
        }),
      };
    case NotificationActions.REMOVE_NOTIFICATIONS:
      return {
        ...state,
        notifications: state.notifications.map((notification) => {
          if (action.payload.includes(notification.id)) {
            notification.hide = true;
            notification.forceHide = false;
            notification.delay = 0;
          }
          return notification;
        }),
      };
    default:
      return state;
  }
};

export { NotificationDispatch };
export default NotificationReducer;
