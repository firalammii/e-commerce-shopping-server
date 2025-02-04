import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	userName: {
		type: String,
		required:true,
	},
	address: {
		street: String,
		city: String,
		state: String,
		country: String,
		zipCode: Number,
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
