import React, { useRef, useEffect, useState } from "react";
import sliderStyle from "../../../styles/slider.module.scss";
import { useLayout } from "../../../context/LayoutProvider";

const Slider = ({ slides }: { slides: Array<React.ReactNode> }) => {
  const { activeSlide, sliderHeight, setSliderHeight } = useLayout();
  const sliderRef = useRef<HTMLDivElement>(null);

  // TODO: temporary fix
  const setSlideHeight = () => {
    if (sliderRef.current) {
      // Update the slider height based on the active slide
      const activeSlideElement = sliderRef.current.children[activeSlide];
      if (activeSlideElement) {
        setSliderHeight(activeSlideElement.clientHeight + 80);
      }
    }
  };

  useEffect(() => {
    // Set initial state based on window size
    setSlideHeight();

    // Add resize event listener
    window.addEventListener("resize", setSlideHeight);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", setSlideHeight);
    };
    // eslint-disable-next-line
  }, [activeSlide]);

  return (
    <div className={sliderStyle.slider} ref={sliderRef}>
      {slides.map((slide, i) => {
        return (
          <div
            key={i}
            className={`${sliderStyle.slide}`}
            style={{
              transform: `translateX(${
                (i + 1) * 100 - 100 * (activeSlide + 1)
              }%) scale(${activeSlide === i ? 1 : 0.9})`,
            }}
          >
            {slide}
          </div>
        );
      })}
      <div
        className={`${sliderStyle.ghostSlide} ${sliderStyle["slide-relative"]}`}
        style={{
          height: `${sliderHeight}px`,
          visibility: `hidden`,
        }}
      ></div>
    </div>
  );
};

export default Slider;
