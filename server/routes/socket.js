const userCtl = require('../controllers/user.controller');
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log('connection');
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded")
      userCtl.offlineUser(socket.id)
    });

    socket.on("callUser", async ({ userToCall, signalData, from, name, avatar }) => {
      io.to(await userCtl.getSocket(userToCall)).emit("callUser", { signal: signalData, from, name, avatar });
    });
    socket.on("callEnded", async ({ to }) => {
      socket.to(await userCtl.getSocket(to)).emit("callEnded");
    })
    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal)
    });
  });
}