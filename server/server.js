const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const rooms = {};
require("./socket-combiner")(io, rooms);

app.get("/", (req, res) => {
  res.send({ message: "api working fine..." });
});

server.listen(8080, () => console.log("server is up on 8080"));
