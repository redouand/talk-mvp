const fs = require("fs")
const { resolve } = require("path")

//hada ghir bach n9asem el file to many files.
const mainSocket = (io, rooms) => {
  const socketPath = resolve(__dirname, 'socket.io')
  fs.readdir(socketPath, (_err, files) => {
    files.map((fileName) => {
      if (fileName !== "index.js") {
        const listener = require(resolve(__dirname,'socket.io', fileName))
        io.on('connection', (client)=>{
          listener(io, client, rooms)
        })
      }
    })
  })
}

module.exports = mainSocket