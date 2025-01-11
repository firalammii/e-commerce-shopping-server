import express from "express";
import { createUser, loginUser, logoutUser, refreshUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/refresh', refreshUser);

router.get('/middleware', authMiddleware, (req, res) => {
	const user = req.user;
	res.status(200).json({
		success: true,
		message: "Authenticated User!",
		user,
	});
});


export default router;

