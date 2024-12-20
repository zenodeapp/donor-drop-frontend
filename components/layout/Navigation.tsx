import React from "react";
import { IconType } from "react-icons";

import sliderStyle from "../../styles/slider.module.scss";
import buttonStyle from "../../styles/button.module.scss";
import globalStyle from "../../styles/global.module.scss";
import { getClassNameByStyle } from "../../helpers/layout";

const Navigation = ({
  tabs,
  activeSlide,
  setActiveSlide,
  setOtherSlidesLocked,
  tabIndex,
}: {
  tabs: Array<{
    name: string;
    Icon: IconType;
    color: string;
    children?: React.ReactNode;
  }>;
  activeSlide: number;
  setActiveSlide: React.Dispatch<React.SetStateAction<number>>;
  setOtherSlidesLocked: React.Dispatch<React.SetStateAction<boolean>>;
  tabIndex?: number;
}) => {
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
              }${activeSlide === i ? ` ${sliderStyle.active}` : ""}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSlide(i);
              }}
              onFocus={() => {
                setOtherSlidesLocked(true);
              }}
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
