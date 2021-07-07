const express = require("express");

const userController = require("../controllers/user.controller.js");
const auth = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/register", userController.register);
router.post("/activate_email", userController.activateEmail);
router.post("/login", userController.login);
router.get("/refresh_token", userController.getAccessToken);
router.post("/forgot", userController.forgotPassword);
router.post("/reset", auth, userController.resetPassword);
router.get("/info/:socketId", auth, userController.getUserInfo);
router.get("/get_all", auth, userController.getAllUsers);
router.get("/logout", auth, userController.logout);
router.patch("/update", auth, userController.updateUser);
router.patch("/update_avatar", auth, userController.updateUserAvatar);
router.post("/update_role/:id", auth, userController.updateUserRole);
router.delete("/delete/:id", auth, userController.deleteUser);


module.exports = router;