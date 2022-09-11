const express = require("express");
const {
  createUser,
  login,
  logout,
  checkUserDetails,
} = require("../controllers/authControler");
const router = express.Router();

router.route("/register").post(createUser);
router.route("/login").post(login);
router.route("/checkDetails").post(checkUserDetails);

router.route("/logout").post(logout);

module.exports = router;
