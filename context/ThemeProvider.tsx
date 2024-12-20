import React from "react";

import bodyStyle from "../styles/body.module.scss";
import { IThemeContext, IThemeProvider } from "./ThemeTypes";
import ThemeReducer, { ThemeDispatch } from "./ThemeReducer";
import { toggleClass } from "../helpers/layout";

const ThemeContext = React.createContext<IThemeContext | undefined>(undefined);

const ThemeProvider = ({ children }: IThemeProvider) => {
  const [state, dispatch] = React.useReducer(ThemeReducer, {
    loading: false,
    showApp: false,
    isConnected: false,
    showResults: false,
    isCollapsed: false,
    isMobileView: false,
    inputInitialized: false,
  });

  const {
    setLoading,
    setShowApp,
    setShowResults,
    setIsConnected,
    setIsCollapsed,
    setIsMobileView,
    setInputInitialized,
  } = ThemeDispatch(dispatch);

  const toggleShowApp = () => setShowApp(!state.showApp);
  const toggleShowResults = () => setShowResults(!state.showResults);
  const toggleIsCollapsed = () => setIsCollapsed(!state.isCollapsed);

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

  React.useEffect(() => {
    toggleClass(bodyStyle["is-collapsed"], state.isCollapsed);

    return () => {
      document.body.classList.remove(bodyStyle["is-collapsed"]);
    };
  }, [state.isCollapsed]);

  return (
    <ThemeContext.Provider
      value={{
        loading: state.loading,
        showApp: state.showApp,
        showResults: state.showResults,
        isConnected: state.isConnected,
        isCollapsed: state.isCollapsed,
        isMobileView: state.isMobileView,
        inputInitialized: state.inputInitialized,

        toggleShowApp,
        toggleShowResults,
        toggleIsCollapsed,

        setLoading,
        setShowApp,
        setIsConnected,
        setShowResults,
        setIsCollapsed,
        setIsMobileView,
        setInputInitialized,
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
