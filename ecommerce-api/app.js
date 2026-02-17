
import express from "express";
import cors from "cors";
import router from "./src/routers/routeEcom.js";
import { connectDB } from "./config/dbConfig.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.json({ message: "Ecommerce API is running" });
});

app.use("/api", router);

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
	res.status(500).json({ error: "Internal server error" });
});

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Failed to connect to MongoDB", error);
		process.exit(1);
	});
