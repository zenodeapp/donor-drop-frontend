import React from "react";
import { IconType } from "react-icons";

import sliderStyle from "../../styles/slider.module.scss";
import buttonStyle from "../../styles/button.module.scss";
import globalStyle from "../../styles/global.module.scss";
import { getClassNameByStyle } from "../../helpers/layout";
import { useLayout } from "../../context/LayoutProvider";
import { useNotification } from "../../context/NotificationProvider";
import { IoAccessibilitySharp } from "react-icons/io5";
import { FaBullseye } from "react-icons/fa";

const Navigation = ({
  tabs,
  ghostSlide,
  setOtherSlidesLocked,
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
  setOtherSlidesLocked: React.Dispatch<React.SetStateAction<boolean>>;
  tabIndex?: number;
}) => {
  const { activeSlide, setActiveSlide } = useLayout();
  const { notify } = useNotification();

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
                  setActiveSlide(i);
                } else {
                  // notify({
                  //   type: "error",
                  //   message: "The donor drop has already ended!",
                  //   options: {
                  //     id: "inaccessible",
                  //     Icon: FaBullseye,
                  //     duration: 5000,
                  //   },
                  // });
                }
              }}
              style={{ opacity: tab.disabled ? 0.2 : undefined }}
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
