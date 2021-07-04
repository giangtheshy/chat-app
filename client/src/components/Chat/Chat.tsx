import React from "react";
import { BsDot } from "react-icons/bs";
import { VscDeviceCameraVideo } from "react-icons/vsc";
import { useHistory } from "react-router-dom";
import "./Chat.scss";

interface Props {
  item: any;
}
const Chat: React.FC<Props> = ({ item }) => {
  const history = useHistory();
  return (
    <div className="chat">
      <div className="chat-header">
        <div className="chat-header__left">
          <h4>{item?.name}</h4>
          <BsDot className="icon" />
        </div>
        <div className="chat-header__right">
          <VscDeviceCameraVideo className="icon" onClick={() => history.push(`/call?id=${item?.socket}`)} />
        </div>
      </div>
      <div className="chat-content"></div>
    </div>
  );
};

export default Chat;
