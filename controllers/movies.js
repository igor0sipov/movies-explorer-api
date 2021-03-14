const Movie = require('../models/movie');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const { someoneElsesMovie, movieNotFound } = require('../configs/config');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({}).then((movieList) => res.send(movieList)).catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const randomMovieId = [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  // временное решение

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;

  User.findById(req.user._id)
    .then((owner) => Movie.create([{
      owner,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailer,
      nameRU,
      nameEN,
      movieId: randomMovieId,
      thumbnail,
    }], { runValidators: true }))
    .then((movie) => res.send(movie[0]))
    .catch((err) => {
      throw new BadRequestError(err);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).then((movie) => {
    if (movie !== null) {
      if (req.user._id !== movie.owner.toString()) {
        throw new ForbiddenError(someoneElsesMovie);
      } else {
        return Movie.deleteOne({ _id: movie._id }).then(() => movie);
      }
    } else {
      throw new NotFoundError(movieNotFound);
    }
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (!err.statusCode) {
        throw new Error();
      }
      return (next(err));
    })
    .catch(next);
};
