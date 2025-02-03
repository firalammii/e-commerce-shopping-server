import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	userName: {
		type: String,
		required:true,
	},
	email: {
		type: String,
		required:true,
		unique: true,
	},
	password: {
		type: String,
		required:true,
	},
	role: {
		type: String,
		default:'user',
	},
},
	{
		timestamps: true
	}
)

export const UserModel = mongoose.model('user', userSchema);
