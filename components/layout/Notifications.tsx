import React from "react";
import { useNotification } from "../../context/NotificationProvider";

import notificationsStyle from "../../styles/notifications.module.scss";
import { getClassNameByStyle } from "../../helpers/layout";

const Notifications = ({ id }: { id?: string }) => {
  const { dismiss, notifications } = useNotification();
  return (
    <ul id={id} className={notificationsStyle["notifications"]}>
      {notifications.map((notification) => {
        return (
          <li
            key={notification.id}
            className={getClassNameByStyle(
              notificationsStyle,
              `notification ${notification.type}${
                notification.hide ? " hide" : ""
              }${notification.forceHide ? " force-hide" : ""}${
                notification.dismissable ? " dismissable" : ""
              }`
            )}
            onClick={() => {
              dismiss(notification.id, undefined, true);
            }}
          >
            {!notification.hideIcon && notification.Icon && (
              <span className={notificationsStyle["notification-icon"]}>
                <notification.Icon size={"1.5rem"} />
              </span>
            )}
            <span className={notificationsStyle["notification-message"]}>
              {notification.message}
            </span>
            {/* {notification.dismissable && notification.duration === Infinity && (
              <span className={notificationsStyle.arrow}></span>
            )} */}
          </li>
        );
      })}
    </ul>
  );
};

export default Notifications;
