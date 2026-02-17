
import express from "express";
import {
	listProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
	getCart,
	addToCart,
	updateCart,
	removeCartItem,
	createOrder,
	listOrders,
	getOrder,
} from "../controllers/contEcom.js";

const router = express.Router();

router.get("/products", listProducts);
router.get("/products/:id", getProduct);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

router.get("/cart", getCart);
router.post("/cart", addToCart);
router.put("/cart", updateCart);
router.delete("/cart/:productId", removeCartItem);

router.post("/orders", createOrder);
router.get("/orders", listOrders);
router.get("/orders/:id", getOrder);

export default router;
