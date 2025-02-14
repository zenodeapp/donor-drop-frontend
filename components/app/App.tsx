import React from "react";
import Slider from "./slider/_Slider";
import Account from "./slider/Account";
import Home from "./slider/Home";
import Donate from "./slider/Donate";
import Target from "./slider/Target";
import sliderStyle from "../../styles/slider.module.scss";
import { useTheme } from "../../context/ThemeProvider";
import {
  FaBullseye,
  FaHandHoldingHeart,
  FaHome,
  FaUser,
  FaWallet,
} from "react-icons/fa";
import Navigation from "../layout/Navigation";
import DonationProgress from "./donations/DonationProgress";
import { ethers } from "ethers";
import { TARGET_ETH } from "../../drop.variables";
import { useDonation } from "../../context/DonationProvider";
import { useLayout } from "../../context/LayoutProvider";
import { DonationPhases } from "../../context/DonationTypes";
import Countdown from "./elements/Countdown";
// import Link from "./slider/Link";

const Input = () => {
  const { showApp, isMobileView, setAppScreenLoaded } = useTheme();
  const { stats, phase } = useDonation();
  const { activeSlide, setActiveSlide } = useLayout();

  const setSlide = (index: number, e: React.FocusEvent<Element, Element>) => {
    if (activeSlide !== index) {
      setActiveSlide(index);

      // Weird shift fix when tabbing
      e.target
        .closest(`.${sliderStyle["slider"]}`)
        ?.scroll({ top: 0, left: 0 });
    }
  };

  const setTabIndex = (index: number) => {
    if (!showApp || isMobileView) return -1;

    if (tabs[index].disabled) {
      return -1;
    }

    return undefined;
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
    // {
    //   name: "LINK",
    //   Icon: FaWallet,
    //   color: "white",
    //   disabled:
    //     phase === DonationPhases.STATUS_NOT_LIVE ||
    //     phase === DonationPhases.STATUS_UNKNOWN,
    // },
  ];

  const slides = [
    <Home
      key={0}
      isActive={activeSlide === 0}
      onFocus={(e) => setSlide(0, e)}
    />,
    <Target
      key={1}
      isActive={activeSlide === 1}
      onFocus={(e) => setSlide(1, e)}
    />,
    <Donate
      key={2}
      isActive={activeSlide === 2}
      onFocus={(e) => setSlide(2, e)}
      tabIndex={setTabIndex(2)}
    />,
    <Account
      key={3}
      isActive={activeSlide === 3}
      onFocus={(e) => setSlide(3, e)}
      tabIndex={setTabIndex(3)}
    />,
    // <Link
    //   key={4}
    //   isActive={activeSlide === 4}
    //   onFocus={(e) => setSlide(4, e)}
    //   tabIndex={setTabIndex(4)}
    // />,
  ];

  React.useEffect(() => {
    setAppScreenLoaded(true);

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <DonationProgress
        value={stats.eth.eligible}
        max={TARGET_ETH}
        min={ethers.parseEther("0")}
        status={<Countdown />}
        showSuperscript={true}
        decimals={2}
      />
      <Navigation
        tabs={tabs}
        ghostSlide={Math.min(activeSlide + 1, 3)}
        tabIndex={!showApp || isMobileView ? -1 : undefined}
      />
      <Slider slides={slides} />
    </>
  );
};

export default Input;
