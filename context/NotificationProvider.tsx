import { v4 as uuid } from "uuid";
import React from "react";
import { IoCheckmarkDoneSharp, IoExit } from "react-icons/io5";
import {
  INotification,
  IPreNotification,
  INotificationContext,
  INotificationMessage,
  INotificationOptions,
  INotificationProvider,
  NotificationResult,
} from "./NotificationTypes";
import NotificationReducer, {
  NotificationDispatch,
} from "./NotificationReducer";
import { FaComment, FaTruckLoading } from "react-icons/fa";

import bodyStyle from "../styles/body.module.scss";
import { toggleClass } from "../helpers/layout";

const NotificationContext = React.createContext<
  INotificationContext | undefined
>(undefined);

const NotificationProvider = ({ children, options }: INotificationProvider) => {
  const [state, dispatch] = React.useReducer(NotificationReducer, {
    limit: options.limit,
    notifications: [],
  });

  const promises = React.useRef<{
    [id: string]: {
      resolve: (value: any | PromiseLike<any>) => void;
      reject: (reason?: any) => void;
      timeoutId: NodeJS.Timeout;
      notificationId: string;
      dismissable: boolean;
    };
  }>({});

  const {
    addNotification,
    setNotifications,
    // editNotification,
    removeNotification,
    // removeNotifications,
  } = NotificationDispatch(dispatch);

  function setTimeoutPromise<T = void>(
    cb: () => T,
    ms: number,
    notificationId: string,
    dismissable?: boolean
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = uuid();

      const timeoutId = setTimeout(() => resolve(cb()), ms);
      promises.current[id] = {
        timeoutId,
        resolve,
        reject,
        notificationId,
        dismissable: dismissable === undefined ? true : dismissable,
      };
    });
  }

  const resolvePromise = (promiseId: string) => {
    promises.current[promiseId].resolve(() => {
      return NotificationResult.DISMISSED;
    });
    clearTimeout(promises.current[promiseId].timeoutId);

    delete promises.current[promiseId];
  };

  const rejectPromise = (promiseId: string) => {
    promises.current[promiseId].reject();
    clearTimeout(promises.current[promiseId].timeoutId);

    delete promises.current[promiseId];
  };

  const rejectPromises = () => {
    Object.keys(promises.current).map((promiseId) => {
      rejectPromise(promiseId);
    });
  };

  const compile = (
    message: INotificationMessage,
    _options?: INotificationOptions
  ) => {
    // if (_options?.id && exists(_options.id)) {
    //   clearTimer(_options.id);
    //   editNotification(message, _options);
    // } else {
    return {
      type: _options?.type || "default",
      id: _options?.id || uuid(),
      message,
      Icon: _options?.Icon || (message === "" ? undefined : FaComment),
      hideIcon:
        _options?.hideIcon !== undefined
          ? _options?.hideIcon
          : options.hideIcon,
      duration: _options?.duration || 5000,
      hide: _options?.delay || 0 > 0 ? true : false,
      forceHide: _options?.delay || 0 > 0 ? true : false,
      delay: _options?.delay || 0,
      ghost: _options?.ghost || false,
      antiGhost: _options?.antiGhost || false,
      dismissable:
        _options?.type === "loading"
          ? false
          : _options?.dismissable === undefined
          ? true
          : _options?.dismissable,
    };
  };

  const error = (
    message: INotificationMessage,
    _options?: INotificationOptions
  ) => {
    if (!_options) _options = {};
    if (!_options.Icon) _options.Icon = IoExit;
    _options.type = "error";

    return compile(message, _options);
  };

  const success = (
    message: INotificationMessage,
    _options?: INotificationOptions
  ) => {
    if (!_options) _options = {};
    if (!_options.Icon) _options.Icon = IoCheckmarkDoneSharp;
    if (options.success?.Icon) _options.Icon = options.success.Icon;
    if (!_options.duration && options.success?.duration)
      _options.duration = options.success.duration;
    _options.type = "success";

    return compile(message, _options);
  };

  const loading = (
    message: INotificationMessage,
    _options?: INotificationOptions
  ) => {
    if (!_options) _options = {};
    if (!_options.Icon) _options.Icon = FaTruckLoading;
    if (!_options.duration) _options.duration = Infinity;
    _options.type = "loading";

    return compile(message, _options);
  };

  const create = (notification: IPreNotification) => {
    const { type, message, options } = notification;

    switch (type) {
      case "success":
        return success(message, options);
      case "error":
        return error(message, options);
      case "loading":
        return loading(message, options);
      default:
        return compile(message, { ...options, type });
    }
  };

  const getPromiseId = (notificationId?: string) => {
    return Object.keys(promises.current).find(
      (promiseId) =>
        promises.current[promiseId].notificationId === notificationId
    );
  };
  const notify = async (notification: IPreNotification, delay?: number) => {
    let result;
    if (state.limit === 1) rejectPromises();
    else {
      const promiseId = getPromiseId(notification.options?.id);
      if (promiseId) rejectPromise(promiseId);
    }

    const _notification = create(notification);

    const show = await showOne(_notification, delay).catch(() => {
      result = NotificationResult.INTERRUPTED;
    });

    if (result === NotificationResult.INTERRUPTED)
      return NotificationResult.INTERRUPTED;
    if (_notification.duration === Infinity) return NotificationResult.INFINITY;

    result = NotificationResult.SHOWN;

    if (show) {
      result = NotificationResult.SUCCESS;

      await hideOne(_notification.id, _notification.duration || 5000).catch(
        // () => {
        //   if (_notification) hideOne(_notification.id, 0);
        // }
        () => {
          result = NotificationResult.INTERRUPTED;
        }
      );
    }

    return result;
  };

  // const notifyChain = async (
  //   chain: Array<{
  //     notification: IPreNotification;
  //     delay?: number;
  //   }>
  // ) => {
  //   rejectPromises();
  //   let result;
  //   let notification: INotification | undefined = undefined;

  //   for (let i = 0; i < chain.length; i++) {
  //     if (result === NotificationResult.INTERRUPTED)
  //       return NotificationResult.INTERRUPTED;
  //     notification = create(chain[i].notification);

  //     await showOne(notification, chain[i].delay).catch(() => {
  //       result = NotificationResult.INTERRUPTED;
  //     });
  //   }

  //   if (result === NotificationResult.INTERRUPTED)
  //     return NotificationResult.INTERRUPTED;
  //   if (notification?.duration === Infinity) return NotificationResult.INFINITY;

  //   result = NotificationResult.SHOWN;
  //   if (notification) {
  //     await hideOne(notification.id, notification.duration || 5000).catch(
  //       () => {
  //         if (notification) hideOne(notification.id, 0);
  //       }
  //     );

  //     result = NotificationResult.SUCCESS;
  //   }

  //   return result;
  // };

  const showOne = async (
    notification: INotification,
    delay?: number
  ): Promise<boolean> => {
    if (delay === undefined || delay === 0) {
      addNotification(notification);
      return true;
    } else {
      return await setTimeoutPromise(
        () => {
          addNotification(notification);
          return true;
        },
        delay,
        notification.id,
        notification.dismissable
      );
    }
  };

  const hideOne = async (
    notificationId: string,
    delay?: number,
    clicked?: boolean
  ) => {
    if (delay === undefined || delay === 0) {
      removeNotification(notificationId, clicked);
      return true;
    } else {
      return await setTimeoutPromise(
        () => {
          removeNotification(notificationId, clicked);
          return true;
        },
        delay,
        notificationId,
        state.notifications.find(
          (notification) => notificationId === notification.id
        )?.dismissable
      );
    }
  };

  // const hideMany = async (notificationIds: Array<string>, delay?: number) => {
  //   if (delay === undefined || delay === 0) {
  //     removeNotifications(notificationIds);
  //     return true;
  //   } else {
  //     return await setTimeoutPromise(
  //       () => {
  //         removeNotifications(notificationIds);
  //         return true;
  //       },
  //       delay,
  //       "_hideMany"
  //     );
  //   }
  // };

  const hideAll = async (clicked?: boolean) => {
    removeNotification(undefined, clicked);
    return true;
  };

  const getNotification = (notificationId: string) => {
    return state.notifications.find(
      (notification) => notification.id === notificationId
    );
  };

  const dismiss = async (
    notificationId: string,
    delay?: number,
    clicked?: boolean
  ) => {
    const notification = getNotification(notificationId);
    if (!notification?.dismissable && clicked) return false;

    const promiseId = Object.keys(promises.current).find(
      (promiseId) =>
        promises.current[promiseId].notificationId === notificationId
    );

    if (promiseId) {
      if (
        (notification?.dismissable === undefined ||
          notification?.dismissable) &&
        clicked
      ) {
        resolvePromise(promiseId);
      } else {
        rejectPromise(promiseId);
      }
    }

    const hide = await hideOne(notificationId, delay, clicked);
    if (!hide) return hide;

    return true;
  };

  // const dismissChain = async (
  //   notificationIds: Array<string>,
  //   delay?: number
  // ) => {
  //   notificationIds.map((notificationId) => {
  //     const promiseId = Object.keys(promises.current).find(
  //       (promiseId) =>
  //         promises.current[promiseId].notificationId === notificationId
  //     );
  //     if (promiseId) rejectPromise(promiseId);
  //   });

  //   const hide = await hideMany(notificationIds, delay);
  //   if (!hide) return hide;

  //   return true;
  // };

  const dismissAll = async (clicked?: boolean) => {
    hideAll(clicked);
    rejectPromises();
    return true;
  };

  // const cancel = (id?: string) => {
  //   if (!id) {
  //     removeNotification();
  //   } else {
  //     removeNotification(id);
  //   }
  // };

  // const clearTimer = (id?: string) => {
  //   if (!id) {
  //     timeouts.current.map((timeout) => {
  //       clearTimeout(timeout.timeoutId);
  //     });

  //     timeouts.current = [];
  //   } else {
  //     const _timeout = timeouts.current.find((timeout) => timeout.id === id);

  //     if (_timeout) {
  //       clearTimeout(_timeout.timeoutId);
  //       timeouts.current = timeouts.current.filter(
  //         (timeout) => timeout.timeoutId !== _timeout.timeoutId
  //       );
  //     }
  //   }
  // };

  // const dismissMany = (ids?: Array<string>, delay?: number) => {
  //   if (!ids) {
  //     dismiss(ids, delay);
  //   } else {
  //     const cb = () => {
  //       for (let i = 0; i < ids.length; i++) {
  //         clearTimer(ids[i]);
  //         cancel(ids[i]);
  //       }
  //     };

  //     if (delay) {
  //       setTimeout(() => {
  //         cb();
  //       }, delay);
  //     } else {
  //       cb();
  //     }
  //   }
  // };

  // const dismiss = (id?: string, delay?: number) => {
  //   if (delay) {
  //     setTimeout(() => {
  //       clearTimer(id);
  //       cancel(id);
  //     }, delay);
  //   } else {
  //     clearTimer(id);
  //     cancel(id);
  //   }
  // };

  React.useEffect(() => {
    const someVisible = state.notifications.some(
      (notification) =>
        (!notification.ghost && !notification.hide) ||
        (notification.antiGhost && notification.delay > 0)
    );

    toggleClass(bodyStyle["notification-visible"], someVisible);
  }, [state.notifications]);

  // React.useEffect(() => {
  //   //Cancel all invisible timeouts
  //   timeouts.current.map((timeout) => {
  //     if (
  //       state.notifications.findIndex(
  //         (notification) => notification.id === timeout.id
  //       ) === -1
  //     )
  //       clearTimer(timeout.id);
  //   });

  //   const _delays = state.notifications
  //     .filter((notification) => notification.delay > 0)
  //     .map((notification) => {
  //       const timeoutId = setTimeout(() => {
  //         // clearTimer(timeoutId.toString());
  //         notify(notification.type, notification.message, {
  //           Icon: notification.Icon,
  //           duration: notification.duration,
  //           ghost: notification.ghost,
  //           antiGhost: notification.antiGhost,
  //           id: notification.id,
  //         });
  //       }, notification.delay);

  //       return {
  //         id: notification.id,
  //         timeoutId,
  //       };
  //     });

  //   const _timeouts = state.notifications
  //     .filter(
  //       (notification) =>
  //         !timeouts.current.find((timeout) => timeout.id === notification.id) &&
  //         !notification.hide &&
  //         notification.duration !== Infinity
  //     )
  //     .map((notification) => {
  //       const timeoutId = setTimeout(() => {
  //         dismiss(notification.id);
  //       }, notification.duration);

  //       return {
  //         id: notification.id,
  //         timeoutId,
  //       };
  //     });

  //   timeouts.current = [...timeouts.current, ..._timeouts, ..._delays];
  // }, [state.notifications]);

  return (
    <NotificationContext.Provider
      value={{
        limit: state.limit,
        notifications: state.notifications,
        setNotifications,
        addNotification,
        notify,
        // notifyChain,
        dismiss,
        dismissAll,
        // dismissChain,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (context === undefined)
    throw new Error(
      "useNotification must be used within the NotificationProvider."
    );

  return context;
};

export { useNotification };
export default NotificationProvider;
