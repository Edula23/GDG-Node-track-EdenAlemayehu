
import mongoose from "mongoose";
import { Product, CartItem, Order } from "../models/modEcom.js";

const sendError = (res, status, message) => {
	return res.status(status).json({ error: message });
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const listProducts = async (req, res) => {
	try {
		const { category, minPrice, maxPrice } = req.query;
		const filter = {};

		if (category) {
			filter.category = category;
		}

		if (minPrice || maxPrice) {
			filter.price = {};
			if (minPrice !== undefined) {
				const min = Number(minPrice);
				if (Number.isNaN(min)) {
					return sendError(res, 400, "minPrice must be a number");
				}
				filter.price.$gte = min;
			}
			if (maxPrice !== undefined) {
				const max = Number(maxPrice);
				if (Number.isNaN(max)) {
					return sendError(res, 400, "maxPrice must be a number");
				}
				filter.price.$lte = max;
			}
		}

		const products = await Product.find(filter).sort({ createdAt: -1 });
		return res.json({ data: products });
	} catch (error) {
		return sendError(res, 500, "Failed to fetch products");
	}
};

export const getProduct = async (req, res) => {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id)) {
			return sendError(res, 400, "Invalid product id");
		}

		const product = await Product.findById(id);
		if (!product) {
			return sendError(res, 404, "Product not found");
		}

		return res.json({ data: product });
	} catch (error) {
		return sendError(res, 500, "Failed to fetch product");
	}
};

export const createProduct = async (req, res) => {
	try {
		const { name, description, price, stock, category, imageUrl } = req.body;

		if (!name || !name.trim()) {
			return sendError(res, 400, "Product name is required");
		}

		const parsedPrice = Number(price);
		if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
			return sendError(res, 400, "Price must be a positive number");
		}

		const parsedStock = Number(stock);
		if (!Number.isFinite(parsedStock) || parsedStock < 0) {
			return sendError(res, 400, "Stock must be a non-negative number");
		}

		const product = await Product.create({
			name: name.trim(),
			description,
			price: parsedPrice,
			stock: parsedStock,
			category,
			imageUrl,
		});

		return res.status(201).json({ data: product });
	} catch (error) {
		return sendError(res, 500, "Failed to create product");
	}
};

export const updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id)) {
			return sendError(res, 400, "Invalid product id");
		}

		const updates = {};
		const { name, description, price, stock, category, imageUrl } = req.body;

		if (name !== undefined) {
			if (!name || !name.trim()) {
				return sendError(res, 400, "Product name is required");
			}
			updates.name = name.trim();
		}

		if (description !== undefined) updates.description = description;
		if (category !== undefined) updates.category = category;
		if (imageUrl !== undefined) updates.imageUrl = imageUrl;

		if (price !== undefined) {
			const parsedPrice = Number(price);
			if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
				return sendError(res, 400, "Price must be a positive number");
			}
			updates.price = parsedPrice;
		}

		if (stock !== undefined) {
			const parsedStock = Number(stock);
			if (!Number.isFinite(parsedStock) || parsedStock < 0) {
				return sendError(res, 400, "Stock must be a non-negative number");
			}
			updates.stock = parsedStock;
		}

		const product = await Product.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});

		if (!product) {
			return sendError(res, 404, "Product not found");
		}

		return res.json({ data: product });
	} catch (error) {
		return sendError(res, 500, "Failed to update product");
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id)) {
			return sendError(res, 400, "Invalid product id");
		}

		const product = await Product.findByIdAndDelete(id);
		if (!product) {
			return sendError(res, 404, "Product not found");
		}

		return res.json({ message: "Product deleted" });
	} catch (error) {
		return sendError(res, 500, "Failed to delete product");
	}
};

export const getCart = async (req, res) => {
	try {
		const items = await CartItem.find().populate("product");
		const total = items.reduce((sum, item) => {
			const price = item.product?.price || 0;
			return sum + price * item.quantity;
		}, 0);

		return res.json({ data: { items, total } });
	} catch (error) {
		return sendError(res, 500, "Failed to fetch cart");
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId, quantity, userId } = req.body;

		if (!productId || !isValidObjectId(productId)) {
			return sendError(res, 400, "Valid productId is required");
		}

		const parsedQuantity = Number(quantity);
		if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
			return sendError(res, 400, "Quantity must be a positive number");
		}

		const product = await Product.findById(productId);
		if (!product) {
			return sendError(res, 404, "Product not found");
		}

		const existing = await CartItem.findOne({ product: productId });
		const nextQuantity = existing ? existing.quantity + parsedQuantity : parsedQuantity;

		if (product.stock < nextQuantity) {
			return sendError(res, 400, "Insufficient stock for this product");
		}

		if (existing) {
			existing.quantity = nextQuantity;
			await existing.save();
			return res.status(200).json({ data: existing });
		}

		const item = await CartItem.create({
			product: productId,
			quantity: parsedQuantity,
			userId: userId || null,
		});

		return res.status(201).json({ data: item });
	} catch (error) {
		return sendError(res, 500, "Failed to add to cart");
	}
};

export const updateCart = async (req, res) => {
	try {
		const { items } = req.body;
		if (!Array.isArray(items)) {
			return sendError(res, 400, "Items array is required");
		}

		if (items.length === 0) {
			await CartItem.deleteMany({});
			return res.json({ data: { items: [], total: 0 } });
		}

		const productIds = items.map((item) => item.productId);
		if (productIds.some((id) => !isValidObjectId(id))) {
			return sendError(res, 400, "All productId values must be valid" );
		}

		const products = await Product.find({ _id: { $in: productIds } });
		const productMap = new Map(products.map((product) => [product.id, product]));

		for (const item of items) {
			const parsedQuantity = Number(item.quantity);
			if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
				return sendError(res, 400, "Quantity must be a positive number");
			}
			const product = productMap.get(item.productId);
			if (!product) {
				return sendError(res, 404, `Product not found: ${item.productId}`);
			}
			if (product.stock < parsedQuantity) {
				return sendError(res, 400, `Insufficient stock for product: ${product.name}`);
			}
		}

		await CartItem.deleteMany({});
		await CartItem.insertMany(
			items.map((item) => ({
				product: item.productId,
				quantity: Number(item.quantity),
				userId: item.userId || null,
			}))
		);

		const updatedItems = await CartItem.find().populate("product");
		const total = updatedItems.reduce((sum, item) => {
			const price = item.product?.price || 0;
			return sum + price * item.quantity;
		}, 0);

		return res.json({ data: { items: updatedItems, total } });
	} catch (error) {
		return sendError(res, 500, "Failed to update cart");
	}
};

export const removeCartItem = async (req, res) => {
	try {
		const { productId } = req.params;
		if (!isValidObjectId(productId)) {
			return sendError(res, 400, "Invalid product id");
		}

		const removed = await CartItem.findOneAndDelete({ product: productId });
		if (!removed) {
			return sendError(res, 404, "Cart item not found");
		}

		return res.json({ message: "Item removed from cart" });
	} catch (error) {
		return sendError(res, 500, "Failed to remove cart item");
	}
};

export const createOrder = async (req, res) => {
	try {
		const { customerInfo } = req.body;
		const cartItems = await CartItem.find().populate("product");

		if (cartItems.length === 0) {
			return sendError(res, 400, "Cart is empty");
		}

		for (const item of cartItems) {
			if (!item.product) {
				return sendError(res, 404, "Product not found in cart");
			}
			if (item.product.stock < item.quantity) {
				return sendError(
					res,
					400,
					`Insufficient stock for product: ${item.product.name}`
				);
			}
		}

		const bulkOps = cartItems.map((item) => ({
			updateOne: {
				filter: { _id: item.product._id, stock: { $gte: item.quantity } },
				update: { $inc: { stock: -item.quantity } },
			},
		}));

		const bulkResult = await Product.bulkWrite(bulkOps);
		if (bulkResult.modifiedCount !== cartItems.length) {
			return sendError(res, 400, "Stock changed. Please retry.");
		}

		const orderItems = cartItems.map((item) => ({
			product: item.product._id,
			name: item.product.name,
			price: item.product.price,
			quantity: item.quantity,
		}));

		const total = orderItems.reduce(
			(sum, item) => sum + item.price * item.quantity,
			0
		);

		const order = await Order.create({
			items: orderItems,
			total,
			customerInfo: customerInfo || {},
		});

		await CartItem.deleteMany({});

		return res.status(201).json({ data: order });
	} catch (error) {
		return sendError(res, 500, "Failed to create order");
	}
};

export const listOrders = async (req, res) => {
	try {
		const orders = await Order.find().sort({ createdAt: -1 });
		return res.json({ data: orders });
	} catch (error) {
		return sendError(res, 500, "Failed to fetch orders");
	}
};

export const getOrder = async (req, res) => {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id)) {
			return sendError(res, 400, "Invalid order id");
		}

		const order = await Order.findById(id);
		if (!order) {
			return sendError(res, 404, "Order not found");
		}

		return res.json({ data: order });
	} catch (error) {
		return sendError(res, 500, "Failed to fetch order");
	}
};
