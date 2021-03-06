import React, { useEffect, useRef, useState } from "react";
import { v1 } from "uuid";
import SOCKETIO from "socket.io-client";
import SimplePeer from "simple-peer";

import { updateRoomEvent } from "./socket.io/updateRooms";
<<<<<<< HEAD
import {
  createOffer,
  receiveOfferEvent,
  receiveCandidateEvent,
  receiveAnswerEvent,
} from "./socket.io/webRTC";
=======
import OutPutAudio from "./components/outputAudio";
>>>>>>> tmp
import joinFile from "./media/join.mp3";
import leaveFile from "./media/leave.mp3";
const socket = SOCKETIO("http://localhost:8080");

const App = () => {
  //-----REFERENCES
  const stream = useRef(null);
  const [callers, setCallers] = useState([]);

  //-----STATES
  const [joinSound] = useState(new Audio(joinFile));
  const [leaveSound] = useState(new Audio(leaveFile));
  const [name, setName] = useState(null);
  const [rooms, setRooms] = useState({});
  const [joinedStatus, setJoinedStatus] = useState({
    joined: false,
    roomId: null,
  });
  const [roomInfo, setRoomInfo] = useState([]);

  //----REFERENCES
  const stream = useRef({});

  useEffect(() => {
    //-----EVENTS
    socket.on("loadRooms", (ROOMS) => setRooms(ROOMS));
    socket.on("updateRoom", updateRoomEvent(setRooms));
<<<<<<< HEAD
    socket.on("otherCallers", otherCallersEvent);
    socket.on("answerReceived", receiveAnswerEvent);
=======
    socket.on("receiveAnswer", ({ answerSdp, from }) => {
      setRoomInfo((roomsInfo) => {
        const approperiate = roomsInfo.find(
          (roomObj) => roomObj.partnerId === from
        );
        console.log('putting the answer to app==>', approperiate.partnerId)
        approperiate?.myHisPeer?.signal(answerSdp);
        return roomsInfo;
      });
    });
  }, []);
>>>>>>> tmp

    //-----RECEIVING CALLS
    socket.on("someoneJoined", (someoneId) =>
      setCallers((callers) => {
        return [...callers, { callerId: someoneId, mp3Element: React.createRef() }];
      })
    );
    socket.on("ice-candidateReceived", receiveCandidateEvent);
  }, []);

  //-------Handle Events
  const otherCallersEvent = (CALLERS) => {
    const tempCallersState = [];
    CALLERS.forEach((callerId) => {
      tempCallersState.push({ callerId, mp3Element: React.createRef() });
    });
    setCallers(tempCallersState);
    createOffer(socket, tempCallersState, stream.current);
  };

<<<<<<< HEAD
  //------HANDLE UI
  const handleJoinRoom = async (e) => {
    const roomId = e.target.parentNode.getAttribute("data-roomid");
    joinSound.play();
    stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    socket.on("offerReceived", receiveOfferEvent(socket, stream.current, callers));
=======
  //-------------ON RECEIVING OFFER
  const receiveOfferEvent = (streamVar) =>({ sdp, from }) => {
    const newCommerPeer = addPeer(streamVar, sdp, from);
    setRoomInfo((roomsInfo)=>{
      return [...roomsInfo, { partnerId: from, myHisPeer: newCommerPeer }]
    });
  };
  const addPeer = (stream, sdp, from) => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
            {
                urls: "stun:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            },
            {
                urls: "turn:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            }
        ]
    },
    });
    peer.signal(sdp);
    peer.on("signal", (answer) =>{
      socket.emit("answer", { to: from, from: socket.id, answerSdp: answer })
      console.log(socket.id + ' is sending answer')
    });
    return peer;
  };



    //-------------ON SENDING OFFER
  const otherUsersEvent = (streamVar) => (OTHERSID) => {
    const roomInfoTemp = [];
    OTHERSID.forEach((otherId) => {
      roomInfoTemp.push({
        partnerId: otherId,
        myHisPeer: createConfiguredPeer(otherId, socket.id, streamVar),
      });
    });
    setRoomInfo(roomInfoTemp);
  };
  const createConfiguredPeer = (otherId, myId, myStream) => {
    const peer = new SimplePeer({
      initiator: true,
      stream: myStream,
      trickle: false,
      config: {
        iceServers: [
            {
                urls: "stun:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            },
            {
                urls: "turn:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            }
        ]
    },
    });
    peer.on("signal", (offer) =>{
      socket.emit("offer", { from: myId, to: otherId, sdp: offer })
    });
    return peer;
  };



  const handleJoinRoom = async (e) => {
    const roomId = e.target.parentNode.getAttribute("data-roomid");
    joinSound.play();
    const streamVar = await navigator.mediaDevices.getUserMedia({audio: true});
    socket.on("otherUsers", otherUsersEvent(streamVar));
    socket.on("receiveOffer", receiveOfferEvent(streamVar));
    stream.current = streamVar;

>>>>>>> tmp
    if (joinedStatus.joined) {
      socket.emit("jumpRoom", {
        prevRoom: joinedStatus.roomId,
        currentRoom: roomId,
        userId: socket.id,
        name: name,
      });
      setJoinedStatus({ joined: true, roomId: roomId });
    } else {
      socket.emit("joinRoom", { roomId, userId: socket.id, name });
      setJoinedStatus({ joined: true, roomId: roomId });
    }
  };

  const handleCreateRoom = () =>
    socket.emit("createRoom", { roomId: v1(), userId: socket.id });

  const handleLeaveRoom = (e) => {
<<<<<<< HEAD
    leaveSound.play();
    stream.current.getTracks()[0].stop();
=======
>>>>>>> tmp
    const roomId = e.target.parentNode.getAttribute("data-roomid");
    leaveSound.play();
    stream.current.getTracks()[0].stop();
    socket.emit("leaveRoom", { roomId, userId: socket.id });
    setJoinedStatus({ joined: false, roomId: null });
  };

  const handleName = (e) => {
    e.preventDefault();
    setName(e.target.children[0].value);
    e.target.children[0].value = "";
  };

<<<<<<< HEAD
  //-------JSX
=======

>>>>>>> tmp
  return (
    <div>
      <form onSubmit={handleName}>
        <input placeholder="must enter name first" />
      </form>

      {name}

<<<<<<< HEAD
      <button onClick={handleCreateRoom} disabled={name === null}>
        CREATE ROOM
      </button>

=======
      <button onClick={handleCreateRoom} disabled={name == null}>
        CREATE ROOM
      </button>
>>>>>>> tmp
      {Object.keys(rooms).map((roomId, i) => (
        <div data-roomid={roomId} key={i}>
          <ul>
            {Object.keys(rooms[roomId]).map((userId, i) => (
              <li key={i}>{rooms[roomId][userId].name}</li>
            ))}
          </ul>
          {joinedStatus.joined && joinedStatus.roomId === roomId ? (
            <button onClick={handleLeaveRoom}>Leave</button>
          ) : (
<<<<<<< HEAD
            <button onClick={handleJoinRoom} disabled={name === null}>
=======
            <button onClick={handleJoinRoom} disabled={name == null}>
>>>>>>> tmp
              Join
            </button>
          )}
        </div>
      ))}
<<<<<<< HEAD
      {callers.map((caller, i) => (
        <audio key={i} autoPlay controls ref={caller.mp3Element} />
      ))}
=======
      {roomInfo.length &&
        roomInfo.map((partnerObj, i) => (
          <OutPutAudio key={i} partner={partnerObj} />
        ))}
>>>>>>> tmp
    </div>
  );
};

export default App;
