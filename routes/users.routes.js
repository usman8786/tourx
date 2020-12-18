const express = require("express");
const router = express.Router();

const UserController = require("../controllers/users.controllers");
// const checkAuth = require('../middleware/check-auth');

router.post("/login", UserController.loginUser);
router.post("/register", UserController.registerUser);
router.put("/:_id", UserController.updateUser);

module.exports = router;
