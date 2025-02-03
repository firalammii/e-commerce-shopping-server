import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
	reviewerName: {
		type: String,
		required: true
	},
	reviewerImg: {
		type: String,
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	rating: {
		type: Number,
		required: true
	},
	productId: {
		type: String,
		required: true
	},
},
	{
		timestamps: true
	}
);

export const ReviewModel = mongoose.model('reviews', reviewSchema);

