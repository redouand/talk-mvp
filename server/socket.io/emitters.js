/*
{
  roomId: {
    socketId1: { name: 'jack', userId: 23423325 },
    socketId2: { name: 'emily', userId: 1324252 }
  },
  roomId2: {
    socketId1: { name: 'chari', userId: 3454323 },
    socketId1: { name: 'chari', userId: 3454323 },
  }
}
*/

const emitters = (io, client, rooms)=>{
  client.emit("loadRooms", rooms);
}

module.exports = emitters