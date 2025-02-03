import fs from 'fs/promises';
import Joi from 'joi';
import { ProductModel } from '../../models/product.model.js';
import { cloudinaryUpload } from "../../helpers/fileUploader.js";
import { Session } from 'inspector/promises';
import { ReviewModel } from '../../models/reviews.model.js';

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
	const { amount, title, category, strict, brand, sortBy } = req.query;

	let searchCriteria = {};
	if (amount) searchCriteria.amount = { $lte: parseInt(amount) };
	if (title) searchCriteria.title = { $regex: title, $options: 'i' };
	if (brand && brand.length > 0) searchCriteria.brand = { $in: brand.split(',') };
	if (category && category.length > 0) searchCriteria.category = strict ? { $all: category.split(',') } : { $elemMatch: { $in: category.split(',') } };

	let orderBy = {};
	if (sortBy) {
		const sorting = sortBy.split('-');
		orderBy = { [sorting[0]]: sorting[1] === 'asc' ? 1 : -1 };
	} else orderBy = { createdAt: -1 }

	try {
		const products = await ProductModel
			.find(searchCriteria)
			.sort(orderBy);
		const totalProds = await ProductModel.countDocuments(searchCriteria)
		return res.status(200).json({
			success: true,
			message: "Getting all Products is Successful",
			products,
			totalProds,
		});
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			success: false,
			message: "Getting all Products failed due to" + error.message,
		});
	}
};

export const createProduct = async (req, res) => {
	try {
		let { imageURL, price, salePrice, amount, title, description, category, brand } = req.body;

		if (!salePrice || salePrice == 0)
			salePrice = price;

		const { error } = joiValidate({ imageURL, price, salePrice, amount, title, description, category, brand });
		if (error) throw new Error(error);

		const product = await ProductModel.create({ imageURL, price, salePrice, amount, title, description, category, brand });

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
		const product = await ProductModel.create({ imageURL, price, salePrice, amount, title, description, category, brand });
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

export const updateProduct = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await ProductModel.findById(id);
		if (!product) throw new Error('No Such Product is Found');
		let { imageURL, price, salePrice, amount, title, description, category, brand } = req.body;
		if (!salePrice || salePrice == 0)
			product.salePrice = price;
		else product.salePrice = salePrice || product.salePrice;
		product.title = title || product.title;
		product.description = description || product.description;
		product.brand = brand || product.brand;
		product.category = category || product.category;
		product.imageURL = imageURL || product.imageURL;
		product.price = price || product.price;
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
export const deleteProduct = async (req, res) => {
	const { id } = req.params;
	try {
		const prod = await ProductModel.findById(id);
		prod.deleted = !prod.deleted;
		// await deleteImage(`public/images/products/${deleted.imageURL}`);
		const deleted = await prod.save();
		return res.status(200).json({
			success: true,
			message: `Successfully ${deleted.deleted ? 'Deleted' : "Restored"} `,
			deleted,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
export const getProduct = async (req, res) => {
	const { id } = req.params;
	try {
		const product = await ProductModel.findById(id);
		product.reviews = await ReviewModel.find({ productId: id }).sort({ createdAt: -1 }).limit(10);
		return res.status(200).json({
			success: true,
			product,
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