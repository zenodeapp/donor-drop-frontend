import React from "react";
import Background from "./Background";

import appStyle from "../../styles/app.module.scss";
import Notifications from "./Notifications";
import notificationsStyle from "../../styles/notifications.module.scss";
import Header from "./Header";
import Content from "./Content";

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
      <Background />
    </>
  );
};

export default MyLayout;
