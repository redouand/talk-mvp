import React, { useEffect, useRef, useState } from "react";
import { v1 } from "uuid";
import SOCKETIO from "socket.io-client";

import { updateRoomEvent } from "./socket.io/updateRooms";
import {
  createOffer,
  receiveOfferEvent,
  receiveCandidateEvent,
  receiveAnswerEvent,
} from "./socket.io/webRTC";
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

  useEffect(() => {
    //-----EVENTS
    socket.on("loadRooms", (ROOMS) => setRooms(ROOMS));
    socket.on("updateRoom", updateRoomEvent(setRooms));
    socket.on("otherCallers", otherCallersEvent);
    socket.on("answerReceived", receiveAnswerEvent);

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

  //------HANDLE UI
  const handleJoinRoom = async (e) => {
    const roomId = e.target.parentNode.getAttribute("data-roomid");
    joinSound.play();
    stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    socket.on("offerReceived", receiveOfferEvent(socket, stream.current, callers));
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
    leaveSound.play();
    stream.current.getTracks()[0].stop();
    const roomId = e.target.parentNode.getAttribute("data-roomid");
    socket.emit("leaveRoom", { roomId, userId: socket.id });
    setJoinedStatus({ joined: false, roomId: null });
  };

  const handleName = (e) => {
    e.preventDefault();
    setName(e.target.children[0].value);
    e.target.children[0].value = "";
  };

  //-------JSX
  return (
    <div>
      <form onSubmit={handleName}>
        <input placeholder="must enter name first" />
      </form>

      {name}

      <button onClick={handleCreateRoom} disabled={name === null}>
        CREATE ROOM
      </button>

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
            <button onClick={handleJoinRoom} disabled={name === null}>
              Join
            </button>
          )}
        </div>
      ))}
      {callers.map((caller, i) => (
        <audio key={i} autoPlay controls ref={caller.mp3Element} />
      ))}
    </div>
  );
};

export default App;
