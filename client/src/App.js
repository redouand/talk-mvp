import React, { useEffect, useRef, useState } from "react";
import { v1 } from "uuid";
import SOCKETIO from "socket.io-client";

import { updateRoomEvent } from './socket.io/updateRooms'
import joinFile from './media/join.mp3'
import leaveFile from './media/leave.mp3'
const socket = SOCKETIO("http://localhost:8080");

const App = () => {
  const [joinSound] = useState(new Audio(joinFile));
  const [leaveSound] = useState(new Audio(leaveFile));
  const [name, setName] = useState("");
  const [rooms, setRooms] = useState({});
  const [joinedStatus, setJoinedStatus] = useState({
    joined: false,
    roomId: null,
  });

  useEffect(() => {
    socket.on("loadRooms", (ROOMS) => setRooms(ROOMS));
    socket.on("updateRoom", updateRoomEvent(setRooms));
  }, []);



  const handleJoinRoom = (e) => {
    joinSound.play()
    const roomId = e.target.parentNode.getAttribute("data-roomid");
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
    leaveSound.play()
    const roomId = e.target.parentNode.getAttribute("data-roomid");
    socket.emit("leaveRoom", { roomId, userId: socket.id });
    setJoinedStatus({ joined: false, roomId: null });
  };

  const handleName = (e) => {
    e.preventDefault();
    setName(e.target.children[0].value);
    e.target.children[0].value = "";
  };

  return (
    <div>
      <form onSubmit={handleName}>
        <input placeholder="must enter name first" />
      </form>

      <button onClick={handleCreateRoom}>CREATE ROOM</button>
      {Object.keys(rooms).map((roomId, i) => (
        <div data-roomid={roomId} key={i}>
          <ul>
            {Object.keys(rooms[roomId]).map((userId, i) => (
              <li key={i}>
                {rooms[roomId][userId].name}
              </li>
            ))}
          </ul>
          {joinedStatus.joined && joinedStatus.roomId === roomId ? (
            <button onClick={handleLeaveRoom}>Leave</button>
          ) : (
            <button onClick={handleJoinRoom}>Join</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default App;
