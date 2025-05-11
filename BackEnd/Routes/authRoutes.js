const express = require("express");
const router = express.Router();
const { register, login, logout, deleteAccount ,sendotp ,verifyotp, resetPassword} = require("../Controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.delete("/delete", deleteAccount);
router.post("/sendotp", sendotp)
router.post("/verifyotp", verifyotp);
router.post("/resetpassword", resetPassword);

module.exports = router;
