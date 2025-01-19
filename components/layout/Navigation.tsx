import React from "react";
import { IconType } from "react-icons";

import appStyle from "../../styles/app.module.scss";
import sliderStyle from "../../styles/slider.module.scss";
import buttonStyle from "../../styles/button.module.scss";
import globalStyle from "../../styles/global.module.scss";
import { getClassNameByStyle } from "../../helpers/layout";
import { useLayout } from "../../context/LayoutProvider";

const Navigation = ({
  tabs,
  ghostSlide,
  tabIndex,
}: {
  tabs: Array<{
    name: string;
    Icon: IconType;
    color: string;
    children?: React.ReactNode;
    disabled?: boolean;
  }>;
  ghostSlide: number;
  tabIndex?: number;
}) => {
  const { activeSlide, smoothNavigate } = useLayout();

  return (
    <nav className={sliderStyle["slider-header-wrapper"]}>
      <div className={sliderStyle["slider-header"]}>
        <div
          className={getClassNameByStyle(
            sliderStyle,
            `selector slide-${activeSlide}`
          )}
          style={
            {
              borderColor: tabs[activeSlide].color,
              "--active-slide": activeSlide,
            } as React.CSSProperties
          }
        ></div>
        {tabs.map((tab, i) => {
          return (
            <button
              key={i}
              className={`${getClassNameByStyle(buttonStyle, "holo")} ${
                globalStyle["no-tap-highlight"]
              }${activeSlide === i ? ` ${sliderStyle.active}` : ""}${
                i <= ghostSlide && activeSlide !== i
                  ? ` ${sliderStyle.ghost}`
                  : ""
              }`}
              onClick={(e) => {
                e.preventDefault();

                if (!tab.disabled) {
                  smoothNavigate(i);
                }
              }}
              style={{ opacity: tab.disabled ? 0.2 : undefined }}
              tabIndex={tabIndex}
            >
              <tab.Icon size='2rem' />
              <span className={sliderStyle["nav-selector-title"]}>
                {tab.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
