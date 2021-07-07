require('dotenv').config();
const express = require('express')
const cors = require('cors');
const cookieParser = require("cookie-parser");

const app = express();
const server = require('http').createServer(app)

const io = require("socket.io")(server, {
  path: "/api/v1/sockjs-node",
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const connection = require('./database/connection');
const socketIO = require('./routes/socket')
const userRoute = require('./routes/user.route');
const friendRoute = require('./routes/friend.route');

const PORT = process.env.PORT || 5000


app.use(cors({
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  origin: process.env.NODE_ENV === "production" ? "https://phim-pro-azure.tk" : "http://localhost",
}))
app.set("trust proxy", 1);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.json());
socketIO(io)
app.get('/api/v1', (req, res) => {
  res.status(200).send("Welcome to backend zê")
})
app.all("*", (req, res, next) => {
  try {
    req.io = io
    next()
  } catch (error) {
    res.status(500).send(error)
  }
})
app.use("/api/v1/user", userRoute);
app.use("/api/v1/friend", friendRoute);

connection
  .then(() => server.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => {
    console.log(err);
  });
