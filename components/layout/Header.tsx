import React from "react";
import { IHeader } from "./_types";
import Socials from "./Socials";

const Header = ({ title, showSocials, children }: IHeader) => {
  return (
    <header>
      {title && <h1>{title}</h1>}
      {showSocials && <Socials />}
      {children}
    </header>
  );
};

Header.defaultProps = {
  showSocials: false,
};

export default Header;
