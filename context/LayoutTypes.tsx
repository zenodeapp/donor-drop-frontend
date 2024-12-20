import React from "react";
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

export type ISocials = {
  className?: string;
  liClassName?: string;
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
  menu: IMenuRecord;
  socials?: Array<ISocialButton>;
};

export type ILayoutContext = ILayoutState & {
  setPreventOverscroll: (preventOverscroll: boolean) => boolean;
};

export type ILayoutProvider = {
  config: {
    appTitle: string;
    defaultMeta: IMeta;
    menu: IMenuRecord;
    socials?: Array<ISocialButton>;
    pages?: IPageRecord;
  };
  children: React.ReactNode;
};

export enum LayoutActions {
  SET_IS_MOBILE = "SET_IS_MOBILE",
  SET_DISPLAY_MODE = "SET_DISPLAY_MODE",
  SET_PREVENT_OVERSCROLL = "SET_PREVENT_OVERSCROLL",
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

export type ISocialButton = {
  id: string;
  url: string;
  Logo: IconType;
  title?: string;
};
