export type IThemeState = {
  loading: boolean;
  showApp: boolean;
  isConnected: boolean;
  showResults: boolean;
  isCollapsed: boolean;
  isMobileView: boolean;
  inputInitialized: boolean;
};

export type IThemeContext = IThemeState & {
  toggleShowApp: () => void;
  toggleShowResults: () => void;
  toggleIsCollapsed: () => void;
  setLoading: (loading: boolean) => boolean;
  setShowApp: (showApp: boolean) => boolean;
  setShowResults: (showResults: boolean) => boolean;
  setIsConnected: (isConnected: boolean) => boolean;
  setIsCollapsed: (isCollapsed: boolean) => boolean;
  setIsMobileView: (isMobileView: boolean) => boolean;
  setInputInitialized: (inputInitialized: boolean) => boolean;
};

export type IThemeProvider = {
  children: React.ReactNode;
};

export enum ThemeActions {
  SET_LOADING = "SET_LOADING",
  SET_SHOW_APP = "SET_SHOW_APP",
  SET_SHOW_RESULTS = "SET_SHOW_RESULTS",
  SET_IS_CONNECTED = "SET_IS_CONNECTED",
  SET_IS_COLLAPSED = "SET_IS_COLLAPSED",
  SET_IS_MOBILE_VIEW = "SET_IS_MOBILE_VIEW",
  SET_INPUT_INITIALIZED = "SET_INPUT_INITIALIZED",
}

export type IThemeActions =
  | {
      type: ThemeActions.SET_LOADING;
      payload: boolean;
    }
  | {
      type: ThemeActions.SET_SHOW_APP;
      payload: boolean;
    }
  | {
      type: ThemeActions.SET_SHOW_RESULTS;
      payload: boolean;
    }
  | {
      type: ThemeActions.SET_IS_CONNECTED;
      payload: boolean;
    }
  | {
      type: ThemeActions.SET_IS_COLLAPSED;
      payload: boolean;
    }
  | {
      type: ThemeActions.SET_IS_MOBILE_VIEW;
      payload: boolean;
    }
  | {
      type: ThemeActions.SET_INPUT_INITIALIZED;
      payload: boolean;
    };
