import React from "react";
import { ILayoutContext, ILayoutProvider } from "./LayoutTypes";

import bodyStyle from "../styles/body.module.scss";
import LayoutReducer, { LayoutDispatch } from "./LayoutReducer";
import { getDisplayMode, isMobile, toggleClass } from "../helpers/layout";

const LayoutContext = React.createContext<ILayoutContext | undefined>(
  undefined
);

const LayoutProvider = ({ config, children }: ILayoutProvider) => {
  const { appTitle, defaultMeta, menu, socials } = config;

  const [state, dispatch] = React.useReducer(LayoutReducer, {
    displayMode: "browser",
    isMobile: false,
    preventOverscroll: false,
    appTitle,
    defaultMeta,
    menu,
    socials,
  });

  const { setIsMobile, setDisplayMode, setPreventOverscroll } =
    LayoutDispatch(dispatch);

  React.useEffect(() => {
    const _isMobile = isMobile();
    setIsMobile(_isMobile);

    const displayMode = getDisplayMode();
    setDisplayMode(displayMode);

    const onChange = (evt: MediaQueryListEvent) => {
      setDisplayMode(evt.matches ? "standalone" : "browser");
    };

    const matchMedia = window.matchMedia("(display-mode: standalone)");

    matchMedia.addEventListener("change", onChange);

    return () => {
      matchMedia.removeEventListener("change", onChange);
    };
  }, []);

  React.useEffect(() => {
    toggleClass(bodyStyle["display-browser"], state.displayMode === "browser");
    toggleClass(
      bodyStyle["display-standalone"],
      state.displayMode === "standalone"
    );
    toggleClass(bodyStyle["display-twa"], state.displayMode === "twa");

    return () => {
      toggleClass(bodyStyle["display-browser"], false);
      toggleClass(bodyStyle["display-standalone"], false);
      toggleClass(bodyStyle["display-twa"], false);
    };
  }, [state.displayMode]);

  React.useEffect(() => {
    toggleClass(
      bodyStyle["prevent-overscroll"],
      state.preventOverscroll,
      "html"
    );

    return () => {
      toggleClass(bodyStyle["prevent-overscroll"], false, "html");
    };
  }, [state.preventOverscroll]);

  return (
    <LayoutContext.Provider
      value={{
        isMobile: state.isMobile,
        displayMode: state.displayMode,
        preventOverscroll: state.preventOverscroll,
        appTitle: state.appTitle,
        defaultMeta: state.defaultMeta,
        menu: state.menu,
        socials: state.socials,

        setPreventOverscroll,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

const useLayout = () => {
  const context = React.useContext(LayoutContext);
  if (context === undefined)
    throw new Error("useLayout must be used within the LayoutProvider.");

  return context;
};

export { useLayout };
export default LayoutProvider;
