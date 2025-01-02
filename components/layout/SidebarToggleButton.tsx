import React from "react";
import { useLayout } from "../../context/LayoutProvider";
import styles from "../../styles/sidebar.module.scss";
import { getClassNameByStyle } from "../../helpers/layout";

const SidebarToggleButton = () => {
  const { sidebarExpanded, setSidebarExpanded } = useLayout();
  return (
    <div
      className={`${getClassNameByStyle(
        styles,
        `toggleButtonWrapper${sidebarExpanded ? " expanded" : " collapsed"}`
      )}`}
      onClick={() => {
        setSidebarExpanded(!sidebarExpanded);
      }}
      aria-label={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
    >
      <div
        className={`${getClassNameByStyle(styles, `toggleButton`)}`}
        onClick={() => {
          setSidebarExpanded(!sidebarExpanded);
        }}
        aria-label={sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
      ></div>
    </div>
  );
};

export default SidebarToggleButton;
