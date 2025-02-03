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
	const { userId, name, address, productId, amount, totalPrice, paid, paymentMethod, paymentStatus, completed } = req.body;

	const { error } = validateOrder({ userId, productId, amount, totalPrice, paid, paymentMethod, paymentStatus, });
	if (error) return res.status(200).json({
		success: false,
		message: error.message
	});


	try {

		const product = await ProductModel.findById(productId);

		const constructedOrder = {
			customer: {
				userId, name, address
			},
			goods: [
				productId, amount, totalPrice, paid,
			],
			paymentMethod, paymentStatus, completed
		};

		const order = await OrderModel.create(extractedOrder);
		const saved = await order.save(order);
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
		productId: Joi.string().required(),
		amount: Joi.number().required(),
		price_pp: Joi.number().required(),
		totalPrice: Joi.number().required(),
		paid: Joi.boolean().required(),
		paymentStatus: Joi.string().required(),
		paymentMethod: Joi.string().required(),
	});

	return orderSchema.validate(order);
};