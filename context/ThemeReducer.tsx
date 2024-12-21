import React from "react";
import { IThemeActions, IThemeState, ThemeActions } from "./ThemeTypes";

const ThemeDispatch = (dispatch: React.Dispatch<IThemeActions>) => {
  return {
    setShowApp: (showApp: boolean) => {
      dispatch({
        type: ThemeActions.SET_SHOW_APP,
        payload: showApp,
      });

      return showApp;
    },
    setIsConnected: (isConnected: boolean) => {
      dispatch({
        type: ThemeActions.SET_IS_CONNECTED,
        payload: isConnected,
      });

      return isConnected;
    },
    setSignedIn: (signedIn: boolean) => {
      dispatch({
        type: ThemeActions.SET_SIGNED_IN,
        payload: signedIn,
      });

      return signedIn;
    },
    setIsMobileView: (isMobileView: boolean) => {
      dispatch({
        type: ThemeActions.SET_IS_MOBILE_VIEW,
        payload: isMobileView,
      });

      return isMobileView;
    },
    setAppScreenLoaded: (appScreenLoaded: boolean) => {
      dispatch({
        type: ThemeActions.SET_APP_SCREEN_LOADED,
        payload: appScreenLoaded,
      });

      return appScreenLoaded;
    },
  };
};

const ThemeReducer = (
  state: IThemeState,
  action: IThemeActions
): IThemeState => {
  switch (action.type) {
    case ThemeActions.SET_SHOW_APP:
      return {
        ...state,
        showApp: action.payload,
        signedIn: !action.payload ? false : state.signedIn,
      };
    case ThemeActions.SET_IS_CONNECTED:
      return {
        ...state,
        isConnected: action.payload,
      };
    case ThemeActions.SET_SIGNED_IN:
      return {
        ...state,
        signedIn: action.payload,
      };
    case ThemeActions.SET_IS_MOBILE_VIEW:
      return { ...state, isMobileView: action.payload };
    case ThemeActions.SET_APP_SCREEN_LOADED:
      return { ...state, appScreenLoaded: action.payload };
    default:
      return state;
  }
};

export default ThemeReducer;
export { ThemeDispatch };
