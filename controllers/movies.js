const Movie = require('../models/movie');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');

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
      thumbnail,
    }], { runValidators: true }))
    .then((movie) => res.send(movie[0]))
    .catch((err) => {
      if (err.errors.country
        || err.errors.director
        || err.errors.duration
        || err.errors.year
        || err.errors.description
        || err.errors.image
        || err.errors.trailer
        || err.errors.nameRU
        || err.errors.nameEN
        || err.errors.thumbnail
      ) {
        throw new BadRequestError(err.message);
      }
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId).then((movie) => {
    if (req.user._id !== movie.owner.toString()) {
      throw new ForbiddenError('Нельзя удалять чужие фильмы');
    } else {
      return Movie.deleteOne({ _id: movie._id }).then(() => movie);
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
