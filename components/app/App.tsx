import React from "react";

import Slider from "./slider/_Slider";

import sliderStyle from "../../styles/slider.module.scss";
import { useTheme } from "../../context/ThemeProvider";
import { FaBullseye, FaHandHoldingHeart, FaHome, FaUser } from "react-icons/fa";
import Account from "./slider/Account";
import Navigation from "../layout/Navigation";
import About from "./slider/About";
import HowTo from "./slider/How";
import Target from "./slider/Target";
import DonationProgress from "./donations/DonationProgress";
import { ethers } from "ethers";
import { TARGET_ETH } from "../../donations.config";
import { useDonation } from "../../context/DonationProvider";
import { useLayout } from "../../context/LayoutProvider";
import { DonationPhases } from "../../context/DonationTypes";
import Countdown from "./elements/Countdown";

const Input = () => {
  const [otherSlidesLocked, setOtherSlidesLocked] = React.useState(false);
  const { showApp, isMobileView, setAppScreenLoaded } = useTheme();
  const { totalDonated, phase } = useDonation();
  const { activeSlide, setActiveSlide } = useLayout();

  // TODO: fix tabbing with this logic some day
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
    if (!showApp || isMobileView) return -1;

    if (otherSlidesLocked && index !== activeSlide) {
      return -1;
    }
  };

  const tabs = [
    {
      name: "HOME",
      Icon: FaHome,
      color: "#eee142",
    },
    {
      name: "TARGET",
      Icon: FaBullseye,
      color: "#ffa665",
    },
    {
      name: "DONATE",
      Icon: FaHandHoldingHeart,
      color: "rgb(127 196 255)",
      disabled:
        phase === DonationPhases.STATUS_ENDED ||
        phase === DonationPhases.STATUS_FILLED ||
        phase === DonationPhases.STATUS_UNKNOWN ||
        phase === DonationPhases.STATUS_NOT_LIVE,
    },
    {
      name: "ACCOUNT",
      Icon: FaUser,
      color: "white",
      disabled:
        phase === DonationPhases.STATUS_NOT_LIVE ||
        phase === DonationPhases.STATUS_UNKNOWN,
    },
  ];

  const slides = [
    <About
      key={0}
      isActive={activeSlide === 0}
      onFocus={(e) => setSlide(0, e)}
    />,
    <Target
      key={1}
      isActive={activeSlide === 1}
      onFocus={(e) => setSlide(1, e)}
    />,
    <HowTo
      key={2}
      isActive={activeSlide === 2}
      onFocus={(e) => setSlide(2, e)}
    />,
    <Account
      key={3}
      isActive={activeSlide === 3}
      onFocus={(e) => setSlide(3, e)}
    />,
  ];

  React.useEffect(() => {
    setAppScreenLoaded(true);

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <DonationProgress
        value={totalDonated}
        max={TARGET_ETH}
        min={ethers.parseEther("0")}
        status={<Countdown />}
        showActual={true}
        showSuperscript={true}
        decimals={2}
      />
      <Navigation
        tabs={tabs}
        ghostSlide={Math.min(activeSlide + 1, 3)}
        setOtherSlidesLocked={setOtherSlidesLocked}
        tabIndex={!showApp || isMobileView ? -1 : undefined}
      />
      <Slider slides={slides} relativeIndex={2} />
    </>
  );
};

export default Input;
