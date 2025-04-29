const express = require ("express");
const router = express.Router();
const {body} = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware =require("../middlewares/auth.middleware");
router.post("/register",[
	body("email").isEmail().withMessage("Email must be more than 5 letters"),
	body("fullname.firstname").isLength({min:3}).withMessage("Firstname must be more than 5 letters"),
	body("password").isLength({min:6}).withMessage("Password must be more than 5 letters")
],userController.registerUser);

router.post("/login",[
	body("email").isEmail().withMessage("Invalid email"),
	body("password").isLength({min:6}).withMessage("Invalid password")
],userController.loginUser);

router.get("/profile",authMiddleware.authUser,userController.getUserProfile);

router.get("/logout",authMiddleware.authUser,userController.logoutUser);

module.exports = router;
