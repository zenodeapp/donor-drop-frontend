export type IThemeState = {
  showApp: boolean;
  isConnected: boolean;
  signedIn: boolean;
  isMobileView: boolean;
  appScreenLoaded: boolean;
};

export type IThemeContext = IThemeState & {
  setShowApp: (showApp: boolean) => boolean;
  setIsConnected: (isConnected: boolean) => boolean;
  setSignedIn: (signedIn: boolean) => boolean;
  setIsMobileView: (isMobileView: boolean) => boolean;
  setAppScreenLoaded: (appScreenLoaded: boolean) => boolean;
  smoothShowApp: (showApp: boolean) => void;
};

export type IThemeProvider = {
  children: React.ReactNode;
};

export enum ThemeActions {
  SET_SHOW_APP = "SET_SHOW_APP",
  SET_IS_CONNECTED = "SET_IS_CONNECTED",
  SET_SIGNED_IN = "SET_SIGNED_IN",
  SET_IS_MOBILE_VIEW = "SET_IS_MOBILE_VIEW",
  SET_APP_SCREEN_LOADED = "SET_APP_SCREEN_LOADED",
}

export type IThemeActions =
  | {
      type: ThemeActions.SET_SHOW_APP;
      payload: boolean;
    }
  | {
      type: ThemeActions.SET_IS_CONNECTED;
      payload: boolean;
    }
  | {
      type: ThemeActions.SET_SIGNED_IN;
      payload: boolean;
    }
  | {
      type: ThemeActions.SET_IS_MOBILE_VIEW;
      payload: boolean;
    }
  | {
      type: ThemeActions.SET_APP_SCREEN_LOADED;
      payload: boolean;
    };
