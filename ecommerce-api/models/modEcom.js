
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		description: { type: String, default: "" },
		price: { type: Number, required: true, min: 0 },
		stock: { type: Number, required: true, min: 0 },
		category: { type: String, default: "" },
		imageUrl: { type: String, default: "" },
	},
	{ timestamps: true }
);

const cartItemSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		quantity: { type: Number, required: true, min: 1 },
		userId: { type: String, default: null },
	},
	{ timestamps: true }
);

const orderItemSchema = new mongoose.Schema(
	{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		name: { type: String, required: true },
		price: { type: Number, required: true, min: 0 },
		quantity: { type: Number, required: true, min: 1 },
	},
	{ _id: false }
);

const orderSchema = new mongoose.Schema(
	{
		items: { type: [orderItemSchema], required: true },
		total: { type: Number, required: true, min: 0 },
		customerInfo: {
			name: { type: String, default: "" },
			email: { type: String, default: "" },
			address: { type: String, default: "" },
			phone: { type: String, default: "" },
		},
		date: { type: Date, default: Date.now },
	},
	{ timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
export const CartItem = mongoose.model("CartItem", cartItemSchema);
export const Order = mongoose.model("Order", orderSchema);
