import React, { JSX } from "react";
import { IconType } from "react-icons";
import { IMeta } from "../components/layout/_types";

export type INavigation = {
  id: string;
  items: Array<IMenuItem>;
  isCollapsed?: boolean;
  classForEachItem?: string;
  className?: string;
  style?: object;
};

export type IPage = {
  id?: string;
  className?: string;
  heading?: string;
  sub?: string;
  children?: React.ReactNode;
};

export type INavigationIcon = {
  Icon: IconType;
  title?: string;
  text?: string | React.ReactNode;
  className?: string;
  textClassName?: string;
  innerClassName?: string;
  size?: string;
};

export type ILayoutState = {
  isMobile: boolean;
  displayMode: "twa" | "browser" | "standalone";
  preventOverscroll: boolean;
  appTitle: string;
  defaultMeta: IMeta;
  menu?: IMenuRecord;
  activeSlide: number;
  sidebarExpanded: boolean;
};

export type ILayoutContext = ILayoutState & {
  setPreventOverscroll: (preventOverscroll: boolean) => boolean;
  setActiveSlide: (activeSlide: number) => number;
  setSidebarExpanded: (sidebarExpanded: boolean) => boolean;
  smoothNavigate: (to: number) => void;
};

export type ILayoutProvider = {
  config: {
    appTitle: string;
    defaultMeta: IMeta;
    menu?: IMenuRecord;
    pages?: IPageRecord;
  };
  children: React.ReactNode;
};

export enum LayoutActions {
  SET_IS_MOBILE = "SET_IS_MOBILE",
  SET_DISPLAY_MODE = "SET_DISPLAY_MODE",
  SET_PREVENT_OVERSCROLL = "SET_PREVENT_OVERSCROLL",
  SET_ACTIVE_SLIDE = "SET_ACTIVE_SLIDE",
  SET_SIDEBAR_EXPANDED = "SET_SIDEBAR_EXPANDED",
}

export type ILayoutActions =
  | {
      type: LayoutActions.SET_IS_MOBILE;
      payload: boolean;
    }
  | {
      type: LayoutActions.SET_DISPLAY_MODE;
      payload: "twa" | "browser" | "standalone";
    }
  | {
      type: LayoutActions.SET_PREVENT_OVERSCROLL;
      payload: boolean;
    }
  | {
      type: LayoutActions.SET_ACTIVE_SLIDE;
      payload: number;
    }
  | {
      type: LayoutActions.SET_SIDEBAR_EXPANDED;
      payload: boolean;
    };

export type IPageItem = {
  title: string;
  icon?: JSX.Element;
};

export type IPageRecord = Record<string, IPageItem>;

export type IMenuItem = {
  id: string;
  href: string;
  replace?: boolean;
  navigationIcon: INavigationIcon;
  className?: string;
  enableHistoryBack?: boolean;
  disableHistoryBack?: boolean;
};

export type IMenuItems = Array<IMenuItem>;
export type IMenuRecord = Record<string, IMenuItems>;
