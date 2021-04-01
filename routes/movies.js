const moviesRouter = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { getErrorText } = require('../configs/config');
const { getAllMovies, addMovie, deleteMovie } = require('../controllers/movies');

moviesRouter.get('/movies', getAllMovies);

moviesRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(60)
      .messages(getErrorText('страна(country)')),
    director: Joi.string().required().min(2).max(60)
      .messages(getErrorText('режисер(director)')),
    duration: Joi.number().required()
      .messages(getErrorText('длительность(duration)')),
    year: Joi.string().required().length(4)
      .messages(getErrorText('год(year)')),
    description: Joi.string().required().min(2)
      .messages(getErrorText('описание(description)')),
    image: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i).required()
      .messages(getErrorText('изображение(image)')),
    trailer: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i).required()
      .messages(getErrorText('трейлер(trailer)')),
    movieId: Joi.number().required()
      .messages(getErrorText('movie id')),
    nameRU: Joi.string().required().min(2).max(30)
      .messages(getErrorText('русское название(nameRU)')),
    nameEN: Joi.string().required().min(2).max(30)
      .messages(getErrorText('английское название(nameEN)')),
    thumbnail: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i).required()
      .messages(getErrorText('миниатюра(thumbnail)')),
  }),
}, {

}), addMovie);

moviesRouter.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
}), deleteMovie);

module.exports = moviesRouter;
