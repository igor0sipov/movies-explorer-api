module.exports = {
  dbName: 'favfilmsdb',
  resourceNotFound: 'Запрашиваемый ресурс не найден',
  someoneElsesMovie: 'Нельзя удалять чужие фильмы',
  movieNotFound: 'Нет фильма с таким id',
  userNotFound: 'Нет пользователя с таким id',
  sameUser: 'Пользователь с таким email уже существует',
  sameMovie: 'Фильм с таким movieId уже существует',
  authorizationRequired: 'Необходима авторизация',
  authorizationFailed: 'Не удалось авторизоваться',
  wrongUserCredentials: 'Неправильные почта или пароль',
  wrongEmail: 'Введен некорректный email',
  wrongLink: 'Некорректная ссылка',
  devJwtSecret: '908f8f3afc1d8d6933041c9134ca019993aaee7ab6685648abce113cd738731f',
  getErrorText: (label) => ({
    'string.base': `Поле ${label} должно быть текстовой строкой`,
    'string.empty': `Поле ${label} не может быть пустым`,
    'string.min': `Минимальная длина поля ${label}: {#limit}`,
    'string.max': `Максимальная длина поля ${label}: {#limit} `,
    'any.required': `Поле ${label} обязательное`,
    'number.base': `Поле ${label} должно быть цифрой`,
    'string.pattern.base': `Поле ${label} должно быть ссылкой`,
  }),
};
