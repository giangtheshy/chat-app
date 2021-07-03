import React from "react";
import "./Avatar.scss";
interface Props {
  avatar?: string;
}
const Avatar: React.FC<Props> = ({ avatar }) => {
  return (
    <div className="avatar">
      <img src={avatar} alt="avatar chat app" />
    </div>
  );
};

export default Avatar;
