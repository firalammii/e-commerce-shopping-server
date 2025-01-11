import mongoose from "mongoose";

export const connectDB = async () => {
	const uri = process.env.dbURI;
	mongoose.connect(uri)
		.then(() => console.log("connected to MongoDB"))
		.catch(err => console.error(`Unable to Connect\n ${err}`));
};