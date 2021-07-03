import React from "react";
import { BsDot } from "react-icons/bs";
import { User } from "../../../types";
import Logo from "../../Custom/Logo/Logo";

interface Props{
  item: User;
  handleClickItemMessage:(item:User)=>void;
}
const MessageItem: React.FC<Props> = ({item,handleClickItemMessage}) => {
  return (
    <article className="item" onClick={() => handleClickItemMessage(item)}>
      <Logo />
      <div className="item-content">
        <div className="item-content__top">
          <div className="item-content__top_left">
            <h5 className="title">{item.name }</h5>
            <BsDot className="icon" />
          </div>
          <div className="item-content__top_right">
            <small className="timer">15 min </small>
          </div>
        </div>
        <div className="item-content__bot">
          <p className="message-text">Provident nulla animi cupiditate nisi! Vel cum deleniti sed </p>
        </div>
      </div>
    </article>
  );
};

export default MessageItem;
