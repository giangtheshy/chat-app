import React, { useEffect } from "react";
import { hot } from "react-hot-loader/root";
import { BrowserRouter as Router, Switch, Route, useHistory, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setCall } from "./store/actions/call.action";
import Home from "./pages/Home/Home";
import Call from "./pages/Call/Call";
import SideBar from "./components/SideBar/SideBar";
import Chart from "./pages/Chart/Chart";
import Application from "./pages/App/Application";
import Notify from "./pages/Notify/Notify";
import Profile from "./pages/Profile/Profile";
import Message from "./pages/Message/Message";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Activation from "./pages/Register/Activation";
import { RootState } from "./store/reducers";
import { get } from "./apis";
import { getUser, setLogin, setToken } from "./store/actions/user.action";
import { FiPhoneCall } from "react-icons/fi";
import Avatar from "./components/Custom/Avatar/Avatar";

const socket = io("http://localhost", { path: "/api/v1/sockjs-node" });

const App = () => {
  const isLogged = useSelector((state: RootState) => state.user.isLogged);
  const token = useSelector((state: RootState) => state.user.token);
  const me = useSelector((state: RootState) => state.call.me);
  const call = useSelector((state: RootState) => state.call);

  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("me", (id) => dispatch(setCall({ me: id })));

    socket.on("callUser", ({ from, name: callerName, signal, avatar }) => {
      dispatch(setCall({ call: { isReceivingCall: true, from, name: callerName, signal, avatar } }));
    });

    dispatch(setCall({ socket }));
    return () => {
      socket.off("callUser");
      socket.off("me");
    };
  }, []);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    if (firstLogin) {
      (async () => {
        const { data } = await get("/user/refresh_token");
        dispatch(setToken(data.access_token));
      })();
    }
  }, [isLogged, dispatch]);
  useEffect(() => {
    if (token && me) {
      dispatch(setLogin());
      dispatch(getUser());
    }
  }, [token, dispatch, me]);

  return (
    <main>
      <Router>
        <div className="wrapper">
          <SideBar />
          <div className="content">
            {call?.call?.isReceivingCall && !call?.callAccepted && (
              <div className={`accept`}>
                <Avatar avatar={call?.call?.avatar} />
                <h4 className="call-name">Calling ...</h4>
                <Link to="/call?answer=true" className="accept-btn">
                  <FiPhoneCall />
                </Link>
              </div>
            )}
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/message" component={Message} />
              <Route path="/call" component={Call} />
              <Route path="/chart" component={Chart} />
              <Route path="/application" component={Application} />
              <Route path="/notify" component={Notify} />
              <Route path="/profile" component={Profile} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/user/activation/:token/active" component={Activation} />
            </Switch>
          </div>
        </div>
      </Router>
    </main>
  );
};

export default hot(App);
