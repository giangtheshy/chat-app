import React from "react";
import Logo from "../Custom/Logo/Logo";
import "./SideBar.scss";
import { TiHomeOutline } from "react-icons/ti";
import { RiAppsLine, RiMessage3Line, RiNotification2Line, RiPieChartLine } from "react-icons/ri";
import { useHistory } from "react-router-dom";
import Avatar from "../Custom/Avatar/Avatar";
import { RootState } from "../../store/reducers";
import { useSelector } from "react-redux";
import { User } from "../../types";

const SideBar = () => {
  const user: User = useSelector((state: RootState) => state.user.user);
  const history = useHistory();
  return (
    <div className="sidebar">
      <Logo />
      <ul className="sidebar-items">
        <li className="item" onClick={() => history.push("/")}>
          <TiHomeOutline />
        </li>
        <li className="item" onClick={() => history.push("/message")}>
          <RiMessage3Line />
        </li>
        <li className="item" onClick={() => history.push("/application")}>
          <RiAppsLine />
        </li>
        <li className="item" onClick={() => history.push("/chart")}>
          <RiPieChartLine />
        </li>
      </ul>
      <ul className="sidebar-items">
        <li className="item" onClick={() => history.push("/notify")}>
          <RiNotification2Line />
        </li>
        <li className="item" onClick={() => history.push("/profile")}>
          {user?.avatar ? <Avatar avatar={user?.avatar} /> : <Logo />}
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
