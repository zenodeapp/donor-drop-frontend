import React from "react";
import { ILayoutActions, ILayoutState, LayoutActions } from "./LayoutTypes";

const LayoutDispatch = (dispatch: React.Dispatch<ILayoutActions>) => {
  return {
    setIsMobile: (isMobile: boolean) => {
      dispatch({
        type: LayoutActions.SET_IS_MOBILE,
        payload: isMobile,
      });

      return isMobile;
    },
    setDisplayMode: (displayMode: "twa" | "browser" | "standalone") => {
      dispatch({
        type: LayoutActions.SET_DISPLAY_MODE,
        payload: displayMode,
      });

      return displayMode;
    },
    setPreventOverscroll: (preventOverscroll: boolean) => {
      dispatch({
        type: LayoutActions.SET_PREVENT_OVERSCROLL,
        payload: preventOverscroll,
      });

      return preventOverscroll;
    },
  };
};

const LayoutReducer = (
  state: ILayoutState,
  action: ILayoutActions
): ILayoutState => {
  switch (action.type) {
    case LayoutActions.SET_IS_MOBILE:
      return { ...state, isMobile: action.payload };
    case LayoutActions.SET_DISPLAY_MODE:
      return { ...state, displayMode: action.payload };
    case LayoutActions.SET_PREVENT_OVERSCROLL:
      return { ...state, preventOverscroll: action.payload };
    default:
      return state;
  }
};

export { LayoutDispatch };
export default LayoutReducer;
