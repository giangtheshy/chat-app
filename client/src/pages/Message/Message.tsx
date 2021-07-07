import React, { useState } from "react";
import "./Message.scss";
import Chat from "../../components/Chat/Chat";
import MessagesList from "../../components/SideBar/MessagesList/MessagesList";
import { User } from "../../types";

const Message = () => {
  const [selectMessage, setSelectMessage] = useState(null);

  const handleClickItemMessage = (item: any) => {
    setSelectMessage(item);
  };
  return (
    <div className="message-page">
      <MessagesList handleClickItemMessage={handleClickItemMessage} />
      <Chat item={selectMessage} />
    </div>
  );
};

export default Message;
