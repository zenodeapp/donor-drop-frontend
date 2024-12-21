import React from "react";

import bodyStyle from "../styles/body.module.scss";
import { IThemeContext, IThemeProvider } from "./ThemeTypes";
import ThemeReducer, { ThemeDispatch } from "./ThemeReducer";
import { toggleClass } from "../helpers/layout";

const ThemeContext = React.createContext<IThemeContext | undefined>(undefined);

const ThemeProvider = ({ children }: IThemeProvider) => {
  const [state, dispatch] = React.useReducer(ThemeReducer, {
    showApp: false,
    isConnected: false,
    signedIn: false,
    isMobileView: false,
    appScreenLoaded: false,
  });

  const {
    setShowApp,
    setIsConnected,
    setSignedIn,
    setIsMobileView,
    setAppScreenLoaded,
  } = ThemeDispatch(dispatch);

  React.useEffect(() => {
    const query = window.matchMedia("(max-width: 1165px)");

    setIsMobileView(query.matches);

    window
      .matchMedia("(max-width: 1165px)")
      .addEventListener("change", (evt) => {
        setIsMobileView(evt.matches);
      });
  }, []);

  React.useEffect(() => {
    toggleClass(bodyStyle["is-connected"], state.isConnected);

    return () => {
      document.body.classList.remove(bodyStyle["is-connected"]);
    };
  }, [state.isConnected]);

  React.useEffect(() => {
    toggleClass(bodyStyle["show-app"], state.showApp);

    return () => {
      document.body.classList.remove(bodyStyle["show-app"]);
    };
  }, [state.showApp]);

  return (
    <ThemeContext.Provider
      value={{
        showApp: state.showApp,
        isConnected: state.isConnected,
        signedIn: state.signedIn,
        isMobileView: state.isMobileView,
        appScreenLoaded: state.appScreenLoaded,

        setShowApp,
        setIsConnected,
        setSignedIn,
        setIsMobileView,
        setAppScreenLoaded,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined)
    throw new Error("useTheme must be used within the ThemeProvider.");

  return context;
};

export { useTheme };
export default ThemeProvider;
