const ioRoom = (io, client, rooms)=>{
  client.on("createRoom", ({ roomId, userId }) => {
    if (rooms[roomId]) client.emit("error", "room exists already");
    rooms[roomId] = { };
    io.emit("updateRoom", ({ newRoom: { roomId } }))
  });


  client.on("joinRoom", ({ roomId, userId, name }) => {
    rooms[roomId][userId] = { name };
    io.emit('updateRoom', { push: { roomId, userId, name } })
    const others = Object.keys(rooms[roomId]).filter((callerId)=>userId !== callerId)
    if(others.length){
      client.emit('otherCallers', others )
      others.forEach((other)=>io.to(other).emit('someoneJoined', other))
    }
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
    const others = Object.keys(rooms[currentRoom]).filter((callerId)=>userId !== callerId)
    if(others.length)
      client.emit('otherCallers', others )
  })


  client.on("leaveRoom", ({ roomId, userId }) => {
    delete rooms[roomId][userId]
    io.emit('updateRoom', { pop: { roomId, userId } })
  });

  client.on('offer', (payload)=>{
    const { targets, ...restofPayload } = payload
    targets.forEach(callerId=>{
      io.to(callerId).emit('offerReceived', restofPayload)
    })
  })

  client.on('ice-candidate', ({ targets, candidate })=>{
    targets.forEach((target)=>{
      io.to(target).emit('ice-candidateReceived', candidate)
    })
  })

  client.on("answer", (payload) => {
    io.to(payload.target).emit("answerReceived", payload);
  });

}

module.exports = ioRoom

// const something = {
//   push: {
//     roomId: 'sdaf@#RFAD',
//     userId: 'asd23resf',
//     name: 'jack'
//   },
//   pop: {
//     roomId: 'sdaf@#RFAD',
//     userId: 'asd23resf',
//     name: 'jack'
//   },
//   add: {
//     roomId: 'aasdf'
//   }
// }


// io.on('connection', socket => {
//   socket.join('some room');
// });
// //And then simply use to or in (they are the same) when broadcasting or emitting:

// io.to('some room').emit('some event');
// //You can emit to several rooms at the same time:

// io.to('room1').to('room2').to('room3').emit('some event');
// //In that case, an union is performed: every socket that is at least in one of the rooms will get the event once (even if the socket is in two or more rooms).
// //You can also broadcast to a room from a given socket:

// io.on('connection', function(socket){
//   socket.to('some room').emit('some event');
// });
