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
	imageURL: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true,
		default: 0.00,
	},
	salePrice: {
		type: Number,
		required: true,
		default: 0.00,
	},
	amount: {
		type: Number,
		required: true,
		default: 0,
	},
},
	{
		timestamps: true
	}
);

const Product = mongoose.model('products', productSchema);

export default Product;