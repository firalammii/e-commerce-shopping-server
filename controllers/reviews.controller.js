import { ReviewModel } from '../models/reviews.model.js';

export const createReview = async (req, res) => {
	const { reviewerName, reviewerImg, productId, comment, rating } = req.body;
	try {
		const review = await ReviewModel.create({ reviewerName, reviewerImg, productId, comment, rating });
		const saved = await review.save();

		return res.status(201).json({
			success: true,
			message: "Successful Review",
			review: saved
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const fetchReviews = async (req, res) => {
	const { id } = req.params;
	try {
		const reviews = await ReviewModel.find({ productId: id }).sort({ createdAt: -1 });
		return res.status(201).json({
			success: true,
			message: "Successful Review",
			reviews
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

