const ioRoom = (io, client, rooms)=>{
  client.on("createRoom", ({ roomId, userId }) => {
    if (rooms[roomId]) client.emit("error", "room exists already");
    rooms[roomId] = { };
    io.emit("updateRoom", ({ newRoom: { roomId } }))
  });


  client.on("joinRoom", ({ roomId, userId, name }) => {
    rooms[roomId][userId] = { name };
    io.emit('updateRoom', { push: { roomId, userId, name } })
  });

  client.on('jumpRoom', ({ prevRoom, currentRoom, name, userId })=>{
    delete rooms[prevRoom][userId]
    rooms[currentRoom][userId] = { name }
    io.emit('updateRoom', {
      pop: {
        roomId: prevRoom,
        userId
      }, 
      push: {
        roomId: currentRoom,
        userId,
        name
      }
    })
  })


  client.on("leaveRoom", ({ roomId, userId }) => {
    delete rooms[roomId][userId]
    io.emit('updateRoom', { pop: { roomId, userId } })
  });
}

module.exports = ioRoom

const something = {
  push: {
    roomId: 'sdaf@#RFAD',
    userId: 'asd23resf',
    name: 'jack'
  },
  pop: {
    roomId: 'sdaf@#RFAD',
    userId: 'asd23resf',
    name: 'jack'
  },
  add: {
    roomId: 'aasdf'
  }
}