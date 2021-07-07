const Friend = require("../models/friend.model")
const User = require("../models/user.model")
const customErrorUnique = require('../utils/customErrorUnique');

const friendCtl = {
  addFriend: async (req, res) => {
    try {
      const { fid } = req.body;
      const request = new Friend({ status: false, user: req.user.id, friend: fid, unique: convertIdToUnique(fid, req.user.id) })
      await request.save()
      const friend = await User.findById(fid)
      const user = await User.findById(req.user.id)
      req.io.to(friend.socket).emit("request-friend", { message: `${user.name} have send a friend request!`, avatar: user.avatar, name: user.name })
      req.io.to(user.socket).emit("add-friend", { message: `${friend.name} got a friend request!` })
      res.status(200).json({ message: "Send request successfully" });

    } catch (error) {
      customErrorUnique(res, error)
    }
  },
  getFriends: async (req, res) => {
    try {
      const id = req.user.id;
      const friends = await Friend.find({ user: id }).populate({ path: "friend", select: "name avatar _id " })
      const requests = await Friend.find({ friend: id, status: false }).populate({ path: "friend", select: "name avatar _id " })
      res.status(200).json({ friends, requests });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  confirmRequest: async (req, res) => {
    try {
      const id = req.params.id;
      await Friend.findOneAndUpdate({ user: id, friend: req.user.id }, { status: true })
      req.io.to(user.socket).emit("add-friend", { message: `${friend.name} have been added to your friends` })
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  removeFriend: async (req, res) => {
    try {

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
}

const convertIdToUnique = (id1, id2) => {
  const arr = [id1, id2]
  return arr.sort().join("")
}

module.exports = friendCtl