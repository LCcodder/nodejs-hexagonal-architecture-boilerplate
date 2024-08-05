# `Express.js` hexagonal architecture boilerplate *(URL shortener)*

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)


![ApacheCassandra](https://img.shields.io/badge/cassandra-%231287B1.svg?style=for-the-badge&logo=apache-cassandra&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

### `REST API` written in `Express.js` with `TypeScript` *using hexagonal architecture* pattern. **Project:** *URL shortener with registration, authorization, URL redirection with caching and URL uses counter*

## Endpoints:
1. `POST:/users` - Registrates new user and returns created row

    Usage: 
    ```JSON
    "email": "email@gmail.com",
    "password": "AJSFa*Fya97GFAD",
    "username": "Example username"
    ```
    Response:
    ```JSON
    "email": "email@gmail.com",
    "username": "Example username",
    "createdAt": "2024-08-05T12:44:11.705Z"
    ```
2. `POST:/auth` - Authorizes user and returns **JWT** token

    Usage: 
    ```JSON
    "email": "email@gmail.com",
    "password": "AJSFa*Fya97GFAD"
    ```
    Response:
    ```JSON
    "token":"afnajkfjoajf87dsf89asuf89asfu89as7f8a7f89asd7fya8d9uf8a9d7fa8d97f89adfd9",
    "expiresIn": "24h"
    ```
3. `GET:/users/me` (requires JWT in `Bearer` header) - Returns user profile

    Authorization:
    ```
    Bearer afnajkfjoajf87dsf89asuf89asfu89as7f8a7f89asd7fya8d9uf8a9d7fa8d97f89adfd9
    ```
4. `POST:/urls` (**optional** JWT in `Bearer` header) - Creates url short-link

    Authorization (**optional**):
    ```
    Bearer afnajkfjoajf87dsf89asuf89asfu89as7f8a7f89asd7fya8d9uf8a9d7fa8d97f89adfd9
    ```
    Usage: 
    ```JSON
    "to": "https://github.com/LCcodder/typing-assets"
    ```
    Response:
    ```JSON
    "id": "Sf531d",
    "to": "https://github.com/LCcodder/typing-assets",
    "createdAt": "2024-08-05T12:44:11.705Z",
    "usesCount": 0
    ```
5. `GET:/:id` - Redirects to initial URL by id param
6. `GET:/urls/:id` - Returns URL object
    Response:
    ```JSON
    "id": "Sf531d",
    "to": "https://github.com/LCcodder/typing-assets",
    "createdAt": "2024-08-05T12:44:11.705Z",
    "usesCount": 0
    ```
7. `GET:/urls` (requires JWT in `Bearer` header) - Returns created URLs

    Authorization:
    ```
    Bearer afnajkfjoajf87dsf89asuf89asfu89as7f8a7f89asd7fya8d9uf8a9d7fa8d97f89adfd9
    ```
    Response:
    ```JSON
    [
        "id": "Sf531d",
        "to": "https://github.com/LCcodder/typing-assets",
        "createdAt": "2024-08-05T12:44:11.705Z",
        "ownerEmail": "email@gmail.com",
        "usesCount": 0
    ]
    ```
## Usage:
+ Make sure that `docker` and `docker compose` are installed on your system

To launch application run: 
```
docker compose up --build
```

If app throws cassandra connection error increase `on_launch_cooldown_ms` field value in `init-cfg.json`

If you want launch app without docker you can find keyspace creation statements in `init_keyspace.cql` file

---
### Made by [LCcodder](https://github.com/LCcodder)