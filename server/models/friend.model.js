const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId

const friendSchema = new mongoose.Schema(
  {
    status: { type: Boolean, required: true },
    unique: { type: String, unique: [true, "you are friend with this account"] },
    user: { type: ObjectId, ref: "users", require: [true, "User  is required"] },
    friend: { type: ObjectId, ref: "users", require: [true, "Friend  is required"] },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("friends", friendSchema);