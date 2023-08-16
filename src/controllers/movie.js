import { validateMovie, validatePartialMovie } from "../schema/movieSchema.js";
import { MovieModel } from "../models/movie/dbMovie.js";

export class MovieController {
	static async getAll(req, res) {
		const { genre } = req.query;
		const movies = await MovieModel.getAll({ genre });
		res.status(200).json(movies);
	}

	static async getById(req, res) {
		const { id } = req.params;
		const movieFound = await MovieModel.getById({ id });

		if (!movieFound)
			return res.status(404).json({ message: "movie not found" });

		res.status(200).json(movieFound);
	}

	static async create(req, res) {
		const result = validateMovie(req.body);

		if (result.error)
			return res.status(400).json({
				error: JSON.parse(result.error.message),
			});

		const newMovie = await MovieModel.create({ data: result.data });

		res.status(201).json(newMovie);
	}

	static async update(req, res) {
		const result = validatePartialMovie(req.body);

		if (result.error)
			return res.status(400).json({
				error: JSON.parse(result.error.message),
			});

		const { id } = req.params;

		const updateMovie = await MovieModel.update({ id, data: result.data });

		if (!updateMovie)
			return res.status(404).json({ message: "movie not found" });

		res.json(updateMovie);
	}

	static async delete(req, res) {
		const { id } = req.params;

		const movieDelete = await MovieModel.delete({ id });

		if (!movieDelete)
			return res.status(404).json({ message: "movie not found" });

		res.json(movieDelete);
	}
}
