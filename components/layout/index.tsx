import React from "react";
import Background from "./Background";

import appStyle from "../../styles/app.module.scss";
import Notifications from "./Notifications";
import notificationsStyle from "../../styles/notifications.module.scss";
import Header from "./Header";
import Content from "./Content";
import Sidebar from "./Sidebar";
import SidebarToggleButton from "./SidebarToggleButton";
import LiveIndicator from "../app/elements/LiveIndicator";
import SocialButtons from "../app/elements/SocialButtons";

const MyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <Content id={appStyle["content"]}>
        <main>{children}</main>
      </Content>
      <div className={notificationsStyle["notifications-wrapper"]}>
        <Notifications id={notificationsStyle["notifications-custom"]} />
      </div>
      <LiveIndicator />
      <SocialButtons />
      <SidebarToggleButton />
      <Sidebar />
      <Background />
    </>
  );
};

export default MyLayout;
