const route = require('express').Router();
const friendCtl = require("../controllers/friend.controller")
const auth = require('../middleware/auth.middleware');

route.post("/", auth, friendCtl.addFriend)
route.get("/", auth, friendCtl.getFriends)
route.delete("/:id", auth, friendCtl.removeFriend)
route.put("/:id", auth, friendCtl.confirmRequest)

module.exports = route