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
    setActiveSlide: (activeSlide: number) => {
      dispatch({
        type: LayoutActions.SET_ACTIVE_SLIDE,
        payload: activeSlide,
      });

      return activeSlide;
    },
    setSidebarExpanded: (sidebarExpanded: boolean) => {
      dispatch({
        type: LayoutActions.SET_SIDEBAR_EXPANDED,
        payload: sidebarExpanded,
      });

      return sidebarExpanded;
    },
    setSliderHeight: (sliderHeight: number) => {
      dispatch({
        type: LayoutActions.SET_SLIDER_HEIGHT,
        payload: sliderHeight,
      });

      return sliderHeight;
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
    case LayoutActions.SET_ACTIVE_SLIDE:
      return { ...state, activeSlide: action.payload };
    case LayoutActions.SET_SIDEBAR_EXPANDED:
      localStorage.setItem(
        "zen.sidebar.expanded",
        action.payload ? "true" : "false"
      );
      return { ...state, sidebarExpanded: action.payload };
    case LayoutActions.SET_SLIDER_HEIGHT:
      return { ...state, sliderHeight: action.payload };
    default:
      return state;
  }
};

export { LayoutDispatch };
export default LayoutReducer;
