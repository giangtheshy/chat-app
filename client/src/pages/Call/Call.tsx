import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { FiPhoneOff } from "react-icons/fi";
import { answerCall, callUser, leaveCall, setCall } from "../../store/actions/call.action";
import { RootState } from "../../store/reducers";
import { ICall } from "../../store/reducers/call.reducer";
import Peer from "simple-peer";
import "./Call.scss";
import { User } from "../../types";

const Call = () => {
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
    // socket?.on("redirect", () => {
    //   history.push("/call?accept=true");
    // });
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      dispatch(setCall({ stream: currentStream }));

      myVideo.current.srcObject = currentStream;
    });
    // return () => {
    //   socket?.off("callEnded");
    //   socket?.off("redirect");
    // };
  }, []);
  // useEffect(() => {
  //   if (call.stream && id) {
  //     handleClickCallUser();
  //   }
  // }, [call.stream, id]);
  // useEffect(() => {
  //   if (answer) {

  //     handleClickAnswer();
  //   }
  // }, [answer, id]);

  function answerCall() {
    dispatch(setCall({ callAccepted: true }));

    const peer = new Peer({ initiator: false, trickle: false, stream: call.stream });

    peer.on("signal", (data) => {
      console.log({ data });

      call.socket?.emit("answerCall", { signal: data, to: call.call?.from });
    });

    peer.on("stream", (currentStream) => {
      console.log({ currentStreamAnswer: currentStream });

      userVideo.current.srcObject = currentStream;
    });
    console.log({ signalAnswer: call.call?.signal });

    peer.signal(call.call?.signal);

    connectionRef.current = peer;
  }

  function callUser() {
    const peer = new Peer({ initiator: true, trickle: false, stream: call.stream });

    peer.on("signal", (data) => {
      console.log({ data });
      socket?.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: call.me,
        name: user.name,
        avatar: user.avatar,
      });
    });

    peer.on("stream", (currentStream) => {
      console.log({ currentStream });

      userVideo.current.srcObject = currentStream;
    });

    socket?.on("callAccepted", (signal) => {
      console.log({ signal });

      peer.signal(signal);
      dispatch(setCall({ callAccepted: true }));
    });

    connectionRef.current = peer;
  }

  function leaveCall() {
    dispatch(setCall({ callEnded: true }));

    connectionRef.current.destroy();

    window.location.href = "/message";
  }

  const handleClickCallUser = () => {
    // dispatch(callUser(id, userVideo, connectionRef));
    callUser();
  };

  const handleClickHangUp = () => {
    socket?.emit("callEnded", { to: id });
    // dispatch(leaveCall(connectionRef));
    leaveCall();
  };
  const handleClickAnswer = () => {
    // dispatch(answerCall(userVideo, connectionRef));
    // socket?.emit("redirect", { to: call.call?.from });
    answerCall();
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
      <button className="call" onClick={handleClickCallUser}>
        <FiPhoneOff /> Call
      </button>
      <button className="answer" onClick={handleClickAnswer}>
        <FiPhoneOff /> Answer Call
      </button>
    </div>
  );
};

export default Call;
