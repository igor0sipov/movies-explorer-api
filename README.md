# movies-explorer-api

В этом проекте создавалось API для для приложения Movies Explorer. 
C помощью данного приложения можно зарегестрироваться и авторизоваться, получить список фильмов со стороннего сервиса, добавить фильм в базу данных, получить список фильмов из базы данных, удалить запись о сохраненном фильме, редактировать аккаунт.

Для этого используются следующие технологии:
* node.js
* Express
* mongoDB

## Endpoints

### User endpoints

```bash
POST /signin - авторизация пользователя
```
```bash
POST /signгз - регистрация пользователя
```
```bash
POST /signout - деавторизация пользователя
```
```bash
GET /users/me - Получение информации об авторизованном пользователе
```
```bash
PATCH /users/me - Редактирование информации авторизованного пользователя
```

### movies endpoints

```bash
GET /movies - Получение списка всех сохраненных фильмов.
```

```bash
POST /movies - Сохранение фильма в избранное
```

```bash
GET /movies/:movieId - Удаление фильма из избранного
```

server-ip: 84.201.167.232

[backend-api-domain(HTTPS)](https://api.movies-explorer.fakealien.students.nomoredomains.icu/)

[backend-api-domain(HTTPS-WWW)](https://www.api.movies-explorer.fakealien.students.nomoredomains.icu/)
