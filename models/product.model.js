import mongoose from "mongoose";

const productSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	brand: {
		type: String,
		required: true
	},
	category: {
		type: Array,
		required: true,
		default: []
	},
	reviews: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'reviews'
	}],
	imageURL: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true,
		default: 0,
	},
	salePrice: {
		type: Number,
		required: true,
	},
	amount: {
		type: Number,
		required: true,
		default: 0,
	},
	deleted: {
		type: Boolean,
		default: false,
	}
},
	{
		timestamps: true
	}
);

export const ProductModel = mongoose.model('products', productSchema);

