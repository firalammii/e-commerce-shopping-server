import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {

	const { token } = req.cookies;
	if (!token)
		return res.status(401).json({
			success: false,
			message: "Unauthorized user!",
		});
	
	try {
		const decoded = jwt.verify(token, "secretOrPrivateKey",);
		req.user = decoded;
		next();
	}catch(err){
		return res.status(401).json({
			success: false,
			message: "Unauthorized user!",
		});
	}
};

export {authMiddleware}