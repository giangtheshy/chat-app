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
      // const idSocket = await userCtl.getSocket(userToCall)
      const idSocket = userToCall
      io.to(idSocket).emit("callUser", { signal: signalData, from, name, avatar });
    });
    socket.on("callEnded", async ({ to }) => {

      // const idSocket = await userCtl.getSocket(to)
      const idSocket = to
      socket.to(idSocket).emit("callEnded");
    })
    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal)
    });
    socket.on("redirect", ({ to }) => {
      io.to(to).emit("redirect")
    });
  });
}