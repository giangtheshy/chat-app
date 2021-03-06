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
  useEffect(() => {
    if (id && call.stream) {
      handleClickCallUser();
    }
  }, [id, call.stream]);
  function handleClickAnswer() {
    setIsCall(true);
    dispatch(setCall({ callAccepted: true }));

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: call.stream,
      config: {
        iceServers: [
          { urls: ["stun:hk-turn1.xirsys.com"] },
          {
            username: "ux2wTRV69C-BBZMnJrDgw_BzTj5Yyn0H5_9ufL9zxUw9MbkaTIYr4JOMLwj6g81VAAAAAGEU0j9naWFuZ3RoZXNoeQ==",
            credential: "a6f15664-fb41-11eb-bd31-0242ac120004",
            urls: [
              "turn:hk-turn1.xirsys.com:80?transport=udp",
              "turn:hk-turn1.xirsys.com:3478?transport=udp",
              "turn:hk-turn1.xirsys.com:80?transport=tcp",
              "turn:hk-turn1.xirsys.com:3478?transport=tcp",
              "turns:hk-turn1.xirsys.com:443?transport=tcp",
              "turns:hk-turn1.xirsys.com:5349?transport=tcp",
            ],
          },
        ],
      },
    });

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
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: call.stream,
      config: {
        iceServers: [
          { urls: ["stun:hk-turn1.xirsys.com"] },
          {
            username: "ux2wTRV69C-BBZMnJrDgw_BzTj5Yyn0H5_9ufL9zxUw9MbkaTIYr4JOMLwj6g81VAAAAAGEU0j9naWFuZ3RoZXNoeQ==",
            credential: "a6f15664-fb41-11eb-bd31-0242ac120004",
            urls: [
              "turn:hk-turn1.xirsys.com:80?transport=udp",
              "turn:hk-turn1.xirsys.com:3478?transport=udp",
              "turn:hk-turn1.xirsys.com:80?transport=tcp",
              "turn:hk-turn1.xirsys.com:3478?transport=tcp",
              "turns:hk-turn1.xirsys.com:443?transport=tcp",
              "turns:hk-turn1.xirsys.com:5349?transport=tcp",
            ],
          },
        ],
      },
    });

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
    </div>
  );
};

export default Call;
