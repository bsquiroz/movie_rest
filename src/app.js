import express from "express";
import cors from "cors";

import "dotenv/config";

import moviesRouter from "./routers/movies-router.js";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Hola mundo",
	});
});

app.use("/api/v1/movies", moviesRouter);

app.listen(PORT, () => {
	console.log(`server on listen in http://localhost:${PORT}`);
});
