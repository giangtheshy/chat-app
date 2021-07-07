const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require("./sendMail.js");
const { google } = require("googleapis");

const User = require("../models/user.model.js");
const cloudinary = require("../utils/cloudinary");

const { OAuth2 } = google.auth;

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const CLIENT_URL = process.env.NODE_ENV === "production" ? `https://${process.env.CLIENT_URL}` : "http://localhost";


const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) return res.status(400).json({ message: "Please fill in all fields." });

      if (!validateEmail(email)) return res.status(400).json({ message: "Invalid emails." });

      const user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "This email already exists." });

      if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = { name, email, password: passwordHash };

      const activation_token = createActivationToken(newUser);

      const url = `${CLIENT_URL}/user/activation/${activation_token}/active`;

      sendMail(email, url, "Xác minh");

      res.status(200).json({ message: "Register success! Please activate your email to start." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body;
      const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET);

      const { name, email, password } = user;

      const check = await User.findOne({ email });
      if (check) return res.status(400).json({ message: "This email already exists." });

      const newUser = new User({ name, email, password });

      await newUser.save();

      res.status(200).json({ message: "Account has been activated." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "This email does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Password is incorrect." });

      const refresh_token = createRefreshToken({ id: user._id, role: user.role });

      res.cookie("refreshtoken", refresh_token, {
        httpOnly: true,
        path: "/api/v1/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        // secure: process.env.NODE_ENV === "production" ? true : false,
      });

      res.status(200).json({ message: "Login successfully." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAccessToken: async (req, res) => {
    try {
      const refresh_token = req.cookies.refreshtoken;

      if (!refresh_token) return res.status(400).json({ message: "Haven't token.Please login now!" });

      jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(400).json({ message: "Please login now!" });

        const access_token = createAccessToken({ id: user.id, role: user.role });

        res.status(200).json({ access_token: access_token });
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "This email does not exist." });

      const access_token = createAccessToken({ id: user._id, role: user.role });

      const url = `${CLIENT_URL}/user/reset/${access_token}`;

      sendMail(email, url, "Reset your password");
      res.status(200).json({ message: "Check your email to reset your password." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;

      const passwordHash = await bcrypt.hash(password, 12);
      console.log(req.user.id);
      await User.findByIdAndUpdate(req.user.id, { password: passwordHash });

      res.status(200).json({ message: "Password successfully changed!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getUserInfo: async (req, res) => {
    try {
      const socketId = req.params.socketId;
      const user = await User.findByIdAndUpdate(req.user.id, { socket: socketId, online: true }, { new: true }).select("-password -friends");

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      // if (req.user.role <= 1) {
      // res.status(404).json({ message: "Access have been denied." });
      // }
      const users = await User.find().select("-password");

      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.user.id, { socket: "", online: false })
      res.clearCookie("refreshtoken", { path: "/api/v1/user/refresh_token" });
      res.status(200).json({ message: "Logged out!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { name } = req.body;
      await User.findOneAndUpdate({ _id: req.user.id }, { name });

      res.status(200).json({ message: "Updated!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateUserAvatar: async (req, res) => {
    try {
      const { avatar } = req.body;
      if (!avatar) return res.status(400).json({ message: "Avatar can not be empty" });
      const uploadResponse = await cloudinary.uploader.upload(avatar, {
        upload_preset: "khumuivietnam",
      });
      await User.findOneAndUpdate({ _id: req.user.id }, { avatar: uploadResponse.secure_url });

      res.status(200).json({ avatar: uploadResponse.secure_url });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateUserRole: async (req, res) => {
    try {
      const { role } = req.body;
      const id = req.params.id;
      if (req.user.role * 1 <= 3) return res.status(400).json({ message: "Access have been denied" });
      await User.findByIdAndUpdate(id, { role: role * 1 });

      res.status(200).json({ message: "Update success!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      if (req.user.role * 1 <= 1) return res.status(400).json({ message: "Access have been denied" });
      const user = await User.findById(req.params.id);
      if (req.user.role <= user.role) return res.status(400).json({ message: "Access have been denied" });
      await User.findOneAndDelete({ _id: req.params.id });

      res.status(200).json({ message: "Deleted success!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  offlineUser: async (socketId) => {
    try {
      await User.findOneAndUpdate({ socket: socketId }, { socket: "", online: false });

    } catch (error) {
      console.log(error.message);
    }
  },
  // addFriends: async (req, res) => {
  //   try {
  //     const id = req.params.id;
  //     const user = await User.findById(req.user.id);
  //     const friend = await User.findByIdAnd
  //     const newUser = await User.findByIdAndUpdate(req.user.id, { friends: [...user.friends, { friend: id }] }, { new: true });

  //     res.status(200).json(newUser);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // },
  // getFriends: async (req, res) => {
  //   try {
  //     const user = await User.findById(req.user.id).populate({ path: "friends.friend", select: "-password -createdAt -updatedAt -email -role" });

  //     res.status(200).json(user.friends);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // },
  getSocket: async (id) => {
    try {
      const user = await User.findById(id);
      return user.socket;
    } catch (error) {
      console.log(error.message);
    }
  }

};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
const createActivationToken = (payload) => jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: "5m" });
const createAccessToken = (payload) => jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
const createRefreshToken = (payload) => jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

module.exports = userController;