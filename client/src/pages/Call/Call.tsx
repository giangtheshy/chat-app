import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { FiPhoneOff } from "react-icons/fi";
import { answerCall, callUser, leaveCall, setCall } from "../../store/actions/call.action";
import { RootState } from "../../store/reducers";
import { ICall } from "../../store/reducers/call.reducer";
import "./Call.scss";

const Call = () => {
  const call: ICall = useSelector((state: RootState) => state.call);
  const socket = useSelector((state: RootState) => state.call.socket);

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
    socket?.on("redirect", () => {
      history.push("/call?accept=true");
    });
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      dispatch(setCall({ stream: currentStream }));

      myVideo.current.srcObject = currentStream;
    });
    return () => {
      socket?.off("callEnded");
      socket?.off("redirect");
    };
  }, []);
  useEffect(() => {
    if (call.stream && id) {
      handleClickCallUser();
    }
  }, [call.stream, id]);
  useEffect(() => {
    if (answer) {
      socket?.emit("redirect", { to: call.call?.from });
      handleClickAnswer();
    }
  }, [answer, id]);

  const handleClickCallUser = () => {
    dispatch(callUser(id, userVideo, connectionRef));
  };

  const handleClickHangUp = () => {
    socket?.emit("callEnded", { to: id });
    dispatch(leaveCall(connectionRef));
  };
  const handleClickAnswer = () => {
    dispatch(answerCall(userVideo, connectionRef));
  };
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
    </div>
  );
};

export default Call;
