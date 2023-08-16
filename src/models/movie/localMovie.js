import { randomUUID } from "node:crypto";
import { readJson } from "../../utils/readJson.js";

const movies = readJson("../../movies.json");

export class MovieModel {
	static async getAll({ genre }) {
		if (genre)
			return movies.filter((movie) =>
				movie.genre.some(
					(g) => g.toLocaleLowerCase() === genre.toLocaleLowerCase()
				)
			);

		return movies;
	}

	static async getById({ id }) {
		return movies.find((movie) => movie.id === id);
	}

	static async create({ data }) {
		const newMovie = {
			id: randomUUID(),
			...data,
		};

		movies.push(newMovie);

		return newMovie;
	}

	static async update({ id, data }) {
		const movieIndex = movies.findIndex((movie) => movie.id === id);

		if (movieIndex === -1) return false;

		const updateMovie = {
			...movies[movieIndex],
			...data,
		};

		movies[movieIndex] = updateMovie;

		return updateMovie;
	}

	static async delete({ id }) {
		const movieIndex = movies.findIndex((movie) => movie.id === id);

		if (!movieIndex) return false;

		const movieDelete = movies.splice(movieIndex, 1);

		return movieDelete;
	}
}
