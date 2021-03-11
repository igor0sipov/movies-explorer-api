const moviesRouter = require('express').Router();
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');

moviesRouter.get('/movies', getMovies);

moviesRouter.post('/movies', addMovie);

moviesRouter.delete('/movies/movieId', deleteMovie);

module.exports = moviesRouter;
