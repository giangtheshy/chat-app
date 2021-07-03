const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true, minlength: 5 },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/giangtheshy/image/upload/v1618042500/dev/khumuivietnam/pcwl6uqwzepykmhnpuks.jpg",
    },
    role: { type: Number, default: 0 },
    socket: { type: String, default: "" },
    online: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);