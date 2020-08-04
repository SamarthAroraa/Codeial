module.exports.chatSockets = function (chatServer) {
  let io = require("socket.io")(chatServer);

  io.sockets.on("connection", function (socket) {
    console.log("backend chat socket running, socket:", socket.id);
    socket.on("disconnect", function () {
      console.log("socket disconnected");
    });
    socket.on("join_room", function (data) {
      console.log("joining request - data: ", data);
      socket.join(data.chatroom);
      io.in(data.chatroom).emit("user_joined", data);
      
    });
  });
};
