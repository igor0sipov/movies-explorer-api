const Movie = require('../models/movie');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const { someoneElsesMovie, movieNotFound, sameMovie } = require('../configs/config');
const CoflictError = require('../errors/conflict-error');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({}).then((movieList) => res.send(movieList)).catch(next);
};

module.exports.addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    movieId,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;

  Movie.init().then(() => User.findById(req.user._id))
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
      movieId,
      thumbnail,
    }], { runValidators: true }))
    .then((movie) => res.send(movie[0]))
    .catch((err) => {
      if (err.message.startsWith('E11000')) {
        throw new CoflictError(sameMovie);
      }
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
