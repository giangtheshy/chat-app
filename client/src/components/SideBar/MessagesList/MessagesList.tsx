import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useSelector } from "react-redux";
import { get } from "../../../apis";
import { RootState } from "../../../store/reducers";
import { User } from "../../../types";
import MessageItem from "./MessageItem";
import "./MessagesList.scss";

interface Props {
  handleClickItemMessage: (item: any) => void;
}
const MessagesList: React.FC<Props> = ({ handleClickItemMessage }) => {
  const [users, setUsers] = useState<User[]>([]);
  const user = useSelector((state: RootState) => state.user.user);
  useEffect(() => {
    (async () => {
      if (user) {
        const { data } = await get("/user/get_all");
        setUsers(data);
      }
    })();
  }, [user]);
  return (
    <div className="messages">
      <div className="messages-search">
        <label htmlFor="search" className="search-label">
          <AiOutlineSearch className="icon" />
          <input type="text" name="search" id="search" placeholder="Search" />
        </label>
      </div>
      <div className="messages-options">
        <button className="all">All messages</button>
        <button className="unread">Unread</button>
      </div>
      <div className="messages-list">
        {users?.map((item) => (
          <MessageItem key={item._id} item={item} handleClickItemMessage={handleClickItemMessage} />
        ))}
      </div>
    </div>
  );
};

export default MessagesList;
