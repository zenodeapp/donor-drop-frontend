import React from "react";
import { ILayoutContext, ILayoutProvider } from "./LayoutTypes";

import bodyStyle from "../styles/body.module.scss";
import appStyle from "../styles/app.module.scss";
import LayoutReducer, { LayoutDispatch } from "./LayoutReducer";
import { getDisplayMode, isMobile, toggleClass } from "../helpers/layout";

const LayoutContext = React.createContext<ILayoutContext | undefined>(
  undefined
);

const LayoutProvider = ({ config, children }: ILayoutProvider) => {
  const { appTitle, defaultMeta, menu } = config;

  const [state, dispatch] = React.useReducer(LayoutReducer, {
    displayMode: "browser",
    isMobile: false,
    preventOverscroll: false,
    appTitle,
    defaultMeta,
    menu,
    activeSlide: 0,
    sidebarExpanded: false,
    sliderHeight: 0,
  });

  const {
    setIsMobile,
    setDisplayMode,
    setPreventOverscroll,
    setActiveSlide,
    setSidebarExpanded,
    setSliderHeight,
  } = LayoutDispatch(dispatch);

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

  React.useEffect(() => {
    toggleClass(bodyStyle["ascended-state"], state.activeSlide === 1);

    return () => {
      toggleClass(bodyStyle["ascended-state"], false);
    };
  }, [state.activeSlide]);

  React.useEffect(() => {
    toggleClass(
      bodyStyle["sidebar-expanded"],

      state.sidebarExpanded,
      "html"
    );

    return () => {
      toggleClass(bodyStyle["sidebar-expanded"], false, "html");
    };
  }, [state.sidebarExpanded]);

  React.useEffect(() => {
    const largeScreenQuery = window.matchMedia("(min-width: 1005px)");

    const onChange = () => {
      setSidebarExpanded(largeScreenQuery.matches);
      setPreventOverscroll(!largeScreenQuery.matches);
    };

    onChange();

    largeScreenQuery.addEventListener("change", onChange);

    return () => {
      largeScreenQuery.removeEventListener("change", onChange);
    };
  }, []);

  // TODO: this is likely a temporary fix to smooth things out when we're scrolled down.
  const smoothNavigate = (to: number) => {
    const pageContentDiv = document.getElementById(appStyle["page-content"]);
    if (pageContentDiv) {
      if (pageContentDiv.scrollTop === 0) {
        setActiveSlide(to);
        return;
      }

      pageContentDiv.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      const interval = setInterval(() => {
        if (pageContentDiv.scrollTop <= 20) {
          setActiveSlide(to);
          clearInterval(interval);
        }
      }, 50);
    }
  };

  return (
    <LayoutContext.Provider
      value={{
        isMobile: state.isMobile,
        displayMode: state.displayMode,
        preventOverscroll: state.preventOverscroll,
        appTitle: state.appTitle,
        defaultMeta: state.defaultMeta,
        menu: state.menu,
        activeSlide: state.activeSlide,
        sidebarExpanded: state.sidebarExpanded,
        sliderHeight: state.sliderHeight,
        setActiveSlide,
        setPreventOverscroll,
        setSidebarExpanded,
        smoothNavigate,
        setSliderHeight,
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
