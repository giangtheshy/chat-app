import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      home page here
      <Link to="/call">move to call</Link>
    </div>
  );
};

export default Home;
