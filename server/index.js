const experss = require("express");
const app = experss();
const http = require("http");
const cors = require("cors");
const { Server } = (require = require("socket.io"));
app.use(cors);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://websockettesting.vercel.app/",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log(data);
  });
});

server.listen(3001, () => {
  console.log("server is runnning");
});
