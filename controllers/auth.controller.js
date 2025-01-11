import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

const createUser = async(req, res) =>{
	const {userName, email, password} = req.body;
	if(!userName || !email || !password)
		return res.status(400).json({
			success:false,
			message: "Insufficient data for Registration!!",
		});

	try {
		const userExists = await User.findOne({ email });
		if (Boolean(userExists))
			return res.status(400).json({
				success: false,
				message: "User Already Exists",
			});

		const salt = await bcrypt.genSalt(12);
		const hashedPwd = await bcrypt.hash(password, salt);
		const userInstance = new User({ userName, email, password: hashedPwd });

		const savedUser = await userInstance.save();
		return res.status(201).json({
			success: true,
			message: "Registration Successful !",
			user: { ...savedUser, password: "" }
		});

	} catch(err){
		return res.status(500).json({
			success: false,
			message: "Registration Failed !",
		});
	}
}
const loginUser = async(req, res) =>{
	const {email, password} = req.body;

	if(!email || !password)
		return res.status(400).json({
			success:false,
			message: "Insufficient data for Authentication!!",
		});
	try {
		const foundUser = await User.findOne({ email: email }).exec();
		if (!Boolean(foundUser))
			return res.status(400).json({
				success: false,
				message: "User does not Exist",
			});

		const matchPwd = await bcrypt.compare(password, foundUser.password);
		if (!Boolean(matchPwd))
			return res.status(400).json({
				success: false,
				message: "Incorrect Credentials",
			});

		const {_id, userName, role} = foundUser;

		const token = jwt.sign({ _id, userName, email, role }, "secretOrPrivateKey", { expiresIn: '30m' });
		
		return res.cookie('token',token, {httpOnly:true,secure:false}).status(200).json({
			success: true,
			message: "Login Successful !",
			user: { _id, userName, email, role }
		});

	} catch(err){
		console.error(err)
		return res.status(500).json({
			success: false,
			message: "Login Failed !",
		});
	}
}

const refreshUser = async (req, res, next) => {
	const { token } = req.cookies;
	if (!token)
		return res.status(401).json({
			success: false,
			message: "Unauthorized user!",
		});
	
	try {
		const decoded = jwt.verify(token, "secretOrPrivateKey",);
		delete(decoded.iat);
		delete(decoded.exp);
		return res.status(200).json({
			success: true,
			message: "Authenticated User!",
			user: decoded,
		});
		
	}catch(err){
		return res.status(401).json({
			success: false,
			message: `Unauthorized User or Session is Expired`,
		});
	}
};

const logoutUser =async(req,res)=>{

	return res.clearCookie("token").status(200).json({
		success: true,
		message: "Logout Successful !",
	});
}



export { createUser, loginUser, logoutUser, refreshUser }