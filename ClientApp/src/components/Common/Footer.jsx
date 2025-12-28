import React from "react";
import { useSelector } from "react-redux";

const Footer = () => {
  const isCollapsed = useSelector(
    (state) => state.auth.isCollapsed
  );

  return (
    <div className={`footer website-footer ${isCollapsed ? "collapsed" : "expanded"}`}>
      <span>This is Website</span>
    </div>
  );
};

export default Footer;
