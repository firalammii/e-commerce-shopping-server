import Joi from "joi";
import { OrderModel } from "../models/order.model.js";
import { UserModel } from "../models/user.model.js";
import { ProductModel } from "../models/product.model.js";
import mongoose from "mongoose";

// userId,
// products: [productId,,]

// export const generateOrder = async (req, res) => {
// 	const { userId, productIds } = req.body;
// 
// 	const products = await Promise.all(productIds.map(prod => ProductModel.findById(prod_id)));
// 
// 	const totalPrice = products.reduce((prev, curr, i) => prev += curr.salePrice * productIds[i].amount);
// 
// 
// 	console.log(orders);
// };
// generateOrder();

export const createOrder = async (req, res) => {
	const { customer, items, paymentMethod, paymentStatus, completed, totalPrice } = req.body;
	const { userId, userName } = customer;
	const { error } = validateOrder({ userId, userName, items, totalPrice, paymentMethod, paymentStatus, completed });
	if (error) return res.status(200).json({
		success: false,
		message: error.message
	});

	try {
		const order = await OrderModel.create({ customer, items, paymentMethod, paymentStatus, completed, totalPrice });
		const saved = await order.save();
		return res.status(201).json({
			success: true,
			message: "order successfully completed",
			order: saved
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

const validateOrder = (order) => {
	const orderSchema = Joi.object({
		userId: Joi.string().required(),
		userName: Joi.string().required(),
		items: Joi.array().min(1).required(),
		totalPrice: Joi.number().required(),
		paymentStatus: Joi.string().required(),
		paymentMethod: Joi.string().required(),
		completed: Joi.boolean(),
	});

	return orderSchema.validate(order);
};