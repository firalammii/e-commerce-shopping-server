import fs from 'fs/promises';
import Joi from 'joi';
import Product from '../../models/product.model.js';
import { cloudinaryUpload } from "../../helpers/fileUploader.js";

export const handleImageUpload = async (req, res) => {
	try {
		const result = req.file;
		// console.log(req.file);
		// const b64 = Buffer.from(req.file.buffer).toString('base64');
		// const url = "data:" + req.file.mimetype + ";base64:" + b64;
		// const result = await cloudinaryUpload(url);
		// console.log(result);
		return res.status(200).json({
			success: true,
			message: "Upload is Successful",
			image: result,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const handleDeleteImage = async (req, res) => {
	try {
		const { image } = req.params;
		const result = await deleteImage(`public/images/products/${image}`);
		return res.status(200).json({
			success: true,
			message: "Deletion is Successful",
			image: result,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
export const deleteImage = async (imgPath) => {
	try {
		const result = await fs.rm(imgPath);
		return result;
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const fetchProducts = async (req, res) => {
	const { amount, title, category, strict, brand } = req.query;
	console.log(brand, category);

	let searchCriteria = {};
	if (amount) searchCriteria.amount = { $lte: parseInt(amount) };
	if (title) searchCriteria.title = { $regex: title, $options: 'i' };
	if (brand && brand.length > 0) searchCriteria.brand = { $in: brand.split(',') };
	if (category && category.length > 0) searchCriteria.category = strict ? { $all: category.split(',') } : { $elemMatch: { $in: category.split(',') } };

	console.log("searchCriteria: ", searchCriteria);
	try {
		const products = await Product.find(searchCriteria)
			.sort({ createdAt: -1 });
		return res.status(200).json({
			success: true,
			message: "Getting all Products is Successful",
			products
		});
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			success: false,
			message: "Getting all Products failed due to" + error.message,
		});
	}
};

export const createProducts = async (req, res) => {
	try {
		const { imageURL, price, salePrice, amount, title, description, category, brand } = req.body;
		const { error } = joiValidate({ imageURL, price, salePrice, amount, title, description, category, brand });
		if (error) throw new Error(error);
		const product = await Product.create({ imageURL, price, salePrice, amount, title, description, category, brand });
		const saved = await product.save();
		return res.status(200).json({
			success: true,
			message: "Successfully Added",
			saved
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const createProductsMulter = async (req, res) => {
	try {
		const { price, salePrice, amount, title, description, category, brand } = req.body;

		console.log(req.body, req.file);
		const imageURL = req.file.filename;

		const { error } = joiValidate({ imageURL, price, salePrice, amount, title, description, category, brand });
		if (error) throw new Error(error);
		const product = await Product.create({ imageURL, price, salePrice, amount, title, description, category, brand });
		const saved = await product.save();
		return res.status(200).json({
			success: true,
			message: "Successfully Added",
			saved
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const updateProducts = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await Product.findById(id);
		if (!product) throw new Error('No Such Product is Found');
		const { imageURL, price, salePrice, amount, title, description, category, brand } = req.body;
		console.log(req.body)
		product.title = title || product.title;
		product.description = description || product.description;
		product.brand = brand || product.brand;
		product.category = category || product.category;
		product.imageURL = imageURL || product.imageURL;
		product.price = price || product.price;
		product.salePrice = salePrice || product.salePrice;
		product.amount = amount || product.amount;

		const updated = await product.save();
		return res.status(200).json({
			success: true,
			message: "Successfully Updated",
			updated
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
export const deleteProducts = async (req, res) => {
	const { id } = req.params;
	try {
		const deleted = await Product.findByIdAndDelete(id);
		return res.status(200).json({
			success: true,
			message: "Successfully Deleted",
			deleted,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const joiValidate = (obj) => {
	const productSchema = Joi.object({
		title: Joi.string().required(),
		description: Joi.string().required(),
		brand: Joi.string().required(),
		category: Joi.array().required(),
		imageURL: Joi.string().required(),
		price: Joi.number().required(),
		salePrice: Joi.number().required(),
		amount: Joi.number().required()
	});

	return productSchema.validate(obj);
};