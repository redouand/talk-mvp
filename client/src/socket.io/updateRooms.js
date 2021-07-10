export const updateRoomEvent = (setRooms)=>(scheme) => {
  if (scheme.push) {
    const { roomId, userId, name } = scheme.push;
    setRooms((rooms) => {
      return { ...rooms, [roomId]: { ...rooms[roomId], [userId]: { name } } };
    });
  }
  if (scheme.pop) {
    const { roomId, userId } = scheme.pop;
    setRooms((rooms) => {
      const { [userId]: omit, ...restUsers } = rooms[roomId];
      return { ...rooms, [roomId]: restUsers };
    });
  }
  if (scheme.newRoom) {
    const { roomId } = scheme.newRoom;
    setRooms((rooms) => {
      return { ...rooms, [roomId]: {} };
    });
  }
};