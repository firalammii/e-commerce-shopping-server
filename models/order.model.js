import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
	customer: {
		userId: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		address: {
			street: String,
			city: String,
			state: String,
			country: String,
			zipCode: Number,
		},
	},

	goods: [
		{
			productId: {
				type: String,
				required: true
			},
			amount: {
				type: Number,
				required: true,
			},
			price_pp: {
				type: Number,
				required: true,
			},
			totalPrice: {
				type: Number,
				required: true,
			},
			paid: {
				type: Boolean,
				required: true,
			},
		},
	],
	paymentMethod: {
		type: String,
		enum: ['PayPal', 'Cash', 'Card'],
	},
	paymentStatus: {
		type: String,
		enum: ['paid', 'unpaid'],
	},
	completed: {
		type: Boolean,
		default: false,
	}
},
	{ timestamps: true }
);

export const OrderModel = mongoose.model('orders', orderSchema);