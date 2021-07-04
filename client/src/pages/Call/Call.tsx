import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { FiPhoneCall, FiPhoneOff } from "react-icons/fi";
import { setCall } from "../../store/actions/call.action";
import { RootState } from "../../store/reducers";
import { ICall } from "../../store/reducers/call.reducer";
import Peer from "simple-peer";
import "./Call.scss";
import { User } from "../../types";

const Call = () => {
  const [isCall, setIsCall] = useState(false);
  const call: ICall = useSelector((state: RootState) => state.call);
  const socket = useSelector((state: RootState) => state.call.socket);
  const user: User = useSelector((state: RootState) => state.user.user);

  const history = useHistory();
  const search = useLocation().search;

  const id: any = new URLSearchParams(search).get("id");
  const answer: any = new URLSearchParams(search).get("answer");

  const myVideo = useRef<any>();
  const userVideo = useRef<any>();
  const connectionRef = useRef<any>();

  const dispatch = useDispatch();
  useEffect(() => {
    socket?.on("callEnded", () => {
      dispatch(setCall({ call: undefined, callAccepted: false, callEnded: false }));
      connectionRef.current.destroy();
      window.location.href = "/message";
    });
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      dispatch(setCall({ stream: currentStream }));

      myVideo.current.srcObject = currentStream;
    });
  }, []);
  useEffect(() => {
    if (answer === "true" && call.stream) {
      handleClickAnswer();
    }
  }, [answer, call.stream]);
  function handleClickAnswer() {
    setIsCall(true);
    dispatch(setCall({ callAccepted: true }));

    const peer = new Peer({ initiator: false, trickle: false, stream: call.stream });

    peer.on("signal", (data) => {
      call.socket?.emit("answerCall", { signal: data, to: call.call?.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    peer.signal(call.call?.signal);

    connectionRef.current = peer;
  }

  function handleClickCallUser() {
    setIsCall(true);
    const peer = new Peer({ initiator: true, trickle: false, stream: call.stream });

    peer.on("signal", (data) => {
      socket?.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: call.me,
        name: user.name,
        uid: user._id,
        avatar: user.avatar,
      });
    });

    peer.on("stream", (currentStream) => {
      console.log({ currentStream });

      userVideo.current.srcObject = currentStream;
    });

    socket?.on("callAccepted", (signal) => {
      peer.signal(signal);
      dispatch(setCall({ callAccepted: true }));
    });

    connectionRef.current = peer;
  }

  function handleClickHangUp() {
    socket?.emit("callEnded", { to: id });
    dispatch(setCall({ callEnded: true }));

    connectionRef.current.destroy();

    window.location.href = "/message";
  }

  return (
    <div className="call">
      <div className="video-container">
        {call.stream && <video className="my-video" playsInline muted ref={myVideo} autoPlay />}
        {call.callAccepted && !call.callEnded && <video className="user-video" playsInline ref={userVideo} autoPlay />}
      </div>

      {call.callAccepted && !call.callEnded && (
        <button className="hang-up" onClick={handleClickHangUp}>
          <FiPhoneOff />
        </button>
      )}
      {!call.callAccepted && !call.call?.isReceivingCall && (
        <button className={`call ${isCall ? "calling" : ""}`} onClick={handleClickCallUser}>
          <FiPhoneCall />
        </button>
      )}
      {/* {!isCall && call.call?.isReceivingCall && (
        <button className={`call calling`} onClick={handleClickAnswer}>
          <FiPhoneCall />
        </button>
      )} */}
    </div>
  );
};

export default Call;
