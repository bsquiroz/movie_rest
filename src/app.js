import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { validateMovie, validatePartialMovie } from "./schema/movieSchema.js";
import { readJson } from "./utils/readJson.js";

const app = express();
const movies = readJson("../../movies.json");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Hola mundo",
	});
});

app.get("/api/v1/movies", (req, res) => {
	const { genre } = req.query;

	if (!genre) return res.status(200).json(movies);

	const filteredMovies = movies.filter((movie) =>
		movie.genre.some(
			(g) => g.toLocaleLowerCase() === genre.toLocaleLowerCase()
		)
	);

	res.status(200).json(filteredMovies);
});

app.get("/api/v1/movies/:id", (req, res) => {
	const { id } = req.params;
	const movieFound = movies.find((movie) => movie.id === id);

	if (!movieFound)
		return res.status(404).json({ message: "movie not found" });

	res.status(200).json(movieFound);
});

app.post("/api/v1/movies", (req, res) => {
	const result = validateMovie(req.body);

	if (result.error)
		return res.status(400).json({
			error: JSON.parse(result.error.message),
		});

	const newMovie = {
		id: randomUUID(),
		...result.data,
	};

	movies.push(newMovie);

	res.status(201).json(newMovie);
});

app.patch("/api/v1/movies/:id", (req, res) => {
	const result = validatePartialMovie(req.body);

	if (result.error)
		return res.status(400).json({
			error: JSON.parse(result.error.message),
		});

	const { id } = req.params;

	const movieIndex = movies.findIndex((movie) => movie.id === id);

	if (movieIndex === -1)
		return res.status(404).json({ message: "movie not found" });

	const updateMovie = {
		...movies[movieIndex],
		...result.data,
	};

	movies[movieIndex] = updateMovie;

	res.json(updateMovie);
});

app.delete("/api/v1/movies/:id", (req, res) => {
	const { id } = req.params;

	const movieIndex = movies.findIndex((movie) => movie.id === id);

	if (movieIndex === -1)
		return res.status(404).json({ message: "movie not found" });

	const movieDelete = movies.splice(movieIndex, 1);

	res.json(movieDelete);
});

app.listen(PORT, () => {
	console.log(`server on listen in http://localhost:${PORT}`);
});
