import React, { useRef } from "react";
import styles from "../../styles/sidebar.module.scss";
import { useLayout } from "../../context/LayoutProvider";
import { FaHandHoldingHeart } from "react-icons/fa";
import { useTheme } from "../../context/ThemeProvider";
import { useNotification } from "../../context/NotificationProvider";
import { IoWalletSharp } from "react-icons/io5";
import { RiUserHeartFill } from "react-icons/ri";
import { useDonation } from "../../context/DonationProvider";

const SidebarHeader = ({
  translateY,
  setTranslateY,
}: {
  translateY: number;
  setTranslateY: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { sidebarExpanded, setSidebarExpanded } = useLayout();
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const { isConnected } = useTheme();
  const { notify } = useNotification();
  const [isMobile, setIsMobile] = React.useState(false);
  const { stats, myDonationCount, filterOn, setFilterOn } = useDonation();

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1005px)");

    // Set initial state
    setIsMobile(mediaQuery.matches);

    // Listen for changes in screen size
    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleResize);

    // Cleanup listener
    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    sidebarRef.current!.dataset.startY = e.touches[0].clientY.toString();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const startY = parseFloat(sidebarRef.current!.dataset.startY || "0");
    const deltaY = e.touches[0].clientY - startY;

    if (
      (sidebarExpanded && deltaY > 0) || // Dragging down when expanded
      (!sidebarExpanded && deltaY < 0) // Dragging up when collapsed
    ) {
      setTranslateY(deltaY * 0.3); // Apply translation during drag
    }
  };

  const handleTouchEnd = () => {
    if (!isMobile) return;
    const threshold = 30; // Minimum drag distance to toggle state

    if (Math.abs(translateY) > threshold) {
      setSidebarExpanded(translateY < 0); // Expand if swiped up, collapse if swiped down
    }

    setTranslateY(0); // Reset translation
  };

  return (
    <div
      className={styles.donationContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={sidebarRef}
    >
      <div
        className={styles.swipeHandle}
        onClick={() => setSidebarExpanded(!sidebarExpanded)}
      ></div>
      <div
        className={`${styles.buttons} ${
          sidebarExpanded ? styles.expanded : styles.collapsed
        }`}
      >
        <button
          onClick={() => {
            if (!sidebarExpanded) setSidebarExpanded(true);
            else if (!filterOn) setSidebarExpanded(!sidebarExpanded);
            setFilterOn(false);
          }}
          className={!filterOn ? styles.active : ""}
        >
          <div className={styles.navIcon}>
            <span className={styles.count}>({stats.transactions.total})</span>
            <FaHandHoldingHeart />
          </div>
          RECENT DONATIONS
        </button>
        <button
          onClick={() => {
            if (isConnected) {
              if (!sidebarExpanded) setSidebarExpanded(true);
              else if (filterOn) setSidebarExpanded(!sidebarExpanded);
              setFilterOn(true);
            } else {
              notify({
                type: "error",
                message:
                  "You have to connect a wallet in order to see your donations.",
                options: {
                  id: "wallet",
                  Icon: IoWalletSharp,
                  duration: 5000,
                },
              });
            }
          }}
          className={filterOn ? styles.active : ""}
        >
          <div className={styles.navIcon}>
            <span className={styles.count}>({myDonationCount})</span>
            <RiUserHeartFill />
          </div>
          MY DONATIONS
          <br />
        </button>
      </div>
    </div>
  );
};

export default SidebarHeader;
