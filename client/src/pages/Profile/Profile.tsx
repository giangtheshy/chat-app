import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { get } from "../../apis";
import { RootState } from "../../store/reducers";
import { User } from "../../types";

const Profile = () => {
  const user: User = useSelector((state: RootState) => state.user.user);

  const handleClickLogout = async () => {
    await get("/user/logout");
    window.location.href = "/";
  };
  return (
    <div>
      {user ? (
        <div>
          <h1>{user.email}</h1>
          <h3>{user.name}</h3>
          <h3>{user.socket}</h3>
          <img src={user.avatar} alt="avatar" />
          <button onClick={handleClickLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
