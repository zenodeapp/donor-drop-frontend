import React from "react";

import Slider from "./Slider";

import sliderStyle from "../../styles/slider.module.scss";
import { useTheme } from "../../context/ThemeProvider";
import { FaHandHoldingHeart, FaUser } from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import Matrices from "./slides/Donations";
import Donate from "./slides/Account";
import Stats from "./slides/Stats";
import Navigation from "../layout/Navigation";

const Input = () => {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [otherSlidesLocked, setOtherSlidesLocked] = React.useState(false);
  const { showApp, isCollapsed, isMobileView, setInputInitialized } =
    useTheme();

  const setSlide = (index: number, e: React.FocusEvent<Element, Element>) => {
    if (activeSlide !== index) {
      setActiveSlide(index);

      // Weird shift fix when tabbing
      e.target
        .closest(`.${sliderStyle["slider"]}`)
        ?.scroll({ top: 0, left: 0 });
    }

    setOtherSlidesLocked(false);
  };

  const setTabIndex = (index: number) => {
    if (!showApp || isCollapsed || isMobileView) return -1;

    if (otherSlidesLocked && index !== activeSlide) {
      return -1;
    }
  };

  const tabs = [
    {
      name: "ACCOUNT",
      Icon: FaUser,
      color: "white",
    },
    {
      name: "DONATIONS",
      Icon: FaHandHoldingHeart,
      color: "rgb(255 231 127)",
    },
    {
      name: "STATS",
      Icon: IoIosStats,
      color: "rgb(127 196 255)",
    },
  ];

  const slides = [
    <Donate
      activeSlide={activeSlide}
      slideIndex={0}
      setSlide={setSlide}
      setTabIndex={setTabIndex}
    />,
    <Matrices onFocus={(e) => setSlide(1, e)} tabIndex={setTabIndex(1)} />,
    <Stats
      onFocus={(e) => {
        setSlide(2, e);
      }}
      tabIndex={setTabIndex(2)}
    />,
  ];

  React.useEffect(() => {
    setInputInitialized(true);

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Navigation
        tabs={tabs}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
        setOtherSlidesLocked={setOtherSlidesLocked}
        tabIndex={!showApp || isCollapsed || isMobileView ? -1 : undefined}
      />
      {/* <form
        id={inputStyle.input}
        autoComplete={"off"}
        onSubmit={(e) => {
          e.preventDefault();

          // if (
          //   namAddress
          // )
          // pairwiseContracts.query();
        }}
      > */}
      <Slider slides={slides} relativeIndex={0} activeSlide={activeSlide} />
      {/* </form> */}
    </>
  );
};

export default Input;
