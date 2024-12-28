import { useState } from "react";
import styles from "../../styles/sidebar.module.scss";
import { useLayout } from "../../context/LayoutProvider";
import TransactionList from "../app/donations/DonationList";
import SidebarHeader from "./SidebarHeader";

const Sidebar = () => {
  const [translateY, setTranslateY] = useState(0);
  const { sidebarExpanded } = useLayout();

  return (
    <div
      className={`${styles.sidebar} ${
        sidebarExpanded ? styles.expanded : styles.collapsed
      }`}
      style={{
        transform:
          translateY === 0
            ? undefined
            : `translateY(${
                translateY > 0
                  ? `calc(-100% + 80px + ${translateY}px))`
                  : `${translateY}px)`
              }`,
        transition: translateY === 0 ? "transform 0.6s ease" : "none",
      }}
    >
      <div className={styles.transactionsHeader}>
        <SidebarHeader translateY={translateY} setTranslateY={setTranslateY} />
      </div>
      <TransactionList />
    </div>
  );
};

export default Sidebar;
