import React from "react";
import { IThemeActions, IThemeState, ThemeActions } from "./ThemeTypes";

const ThemeDispatch = (dispatch: React.Dispatch<IThemeActions>) => {
  return {
    setLoading: (loading: boolean) => {
      dispatch({
        type: ThemeActions.SET_LOADING,
        payload: loading,
      });

      return loading;
    },
    setShowApp: (showApp: boolean) => {
      dispatch({
        type: ThemeActions.SET_SHOW_APP,
        payload: showApp,
      });

      return showApp;
    },
    setShowResults: (showResults: boolean) => {
      dispatch({
        type: ThemeActions.SET_SHOW_RESULTS,
        payload: showResults,
      });

      return showResults;
    },
    setIsConnected: (isConnected: boolean) => {
      dispatch({
        type: ThemeActions.SET_IS_CONNECTED,
        payload: isConnected,
      });

      return isConnected;
    },
    setIsCollapsed: (isCollapsed: boolean) => {
      dispatch({
        type: ThemeActions.SET_IS_COLLAPSED,
        payload: isCollapsed,
      });

      return isCollapsed;
    },
    setIsMobileView: (isMobileView: boolean) => {
      dispatch({
        type: ThemeActions.SET_IS_MOBILE_VIEW,
        payload: isMobileView,
      });

      return isMobileView;
    },
    setInputInitialized: (inputInitialized: boolean) => {
      dispatch({
        type: ThemeActions.SET_INPUT_INITIALIZED,
        payload: inputInitialized,
      });

      return inputInitialized;
    },
  };
};

const ThemeReducer = (
  state: IThemeState,
  action: IThemeActions
): IThemeState => {
  switch (action.type) {
    case ThemeActions.SET_LOADING:
      return { ...state, loading: action.payload };
    case ThemeActions.SET_SHOW_APP:
      return { ...state, showApp: action.payload };
    case ThemeActions.SET_SHOW_RESULTS:
      return { ...state, showResults: action.payload };
    case ThemeActions.SET_IS_CONNECTED:
      return { ...state, isConnected: action.payload, showApp: action.payload };
    case ThemeActions.SET_IS_COLLAPSED:
      return { ...state, isCollapsed: action.payload };
    case ThemeActions.SET_IS_MOBILE_VIEW:
      return { ...state, isMobileView: action.payload };
    case ThemeActions.SET_INPUT_INITIALIZED:
      return { ...state, inputInitialized: action.payload };
    default:
      return state;
  }
};

export default ThemeReducer;
export { ThemeDispatch };
