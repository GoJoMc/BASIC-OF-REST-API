# Basic of REST API

A REST API built with **Express.js, TypeScript, and MongoDB**. This project focuses on the fundamentals of building an API with user authentication, protected routes, password hashing, and JWT-based authentication using HTTP-only cookies.

## About The Project

This project is a learning project where I explore how authentication and user management work in a backend application.

It includes user registration, login, logout, and protected endpoints for managing the currently authenticated user's account.

## Features

- User registration with automatic login
- Login using email or username
- Password hashing with Argon2
- JWT access tokens signed with `jose`
- HTTP-only authentication cookies
- Protected routes using authentication middleware
- Get the currently authenticated user's profile
- Update username, email, and password
- Delete the currently authenticated user's account
- MongoDB integration with Mongoose
- TypeScript strict mode

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** MongoDB
- **ODM:** Mongoose
- **Password Hashing:** Argon2
- **Authentication:** JWT (`jose`)
- **Cookie Handling:** cookie-parser
- **Development:** Nodemon + tsx

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/GoJoMc/BASIC-OF-REST-API.git
cd BASIC-OF-REST-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
MONGO_URL=mongodb://127.0.0.1:27017/basic-of-rest-api
JWT_SECRET=replace_this_with_a_long_random_secret
PORT=8080
NODE_ENV=development
```

| Variable     | Description                                                |
| ------------ | ---------------------------------------------------------- |
| `MONGO_URL`  | MongoDB connection string                                  |
| `JWT_SECRET` | Secret used to sign and verify JWTs                        |
| `PORT`       | Port used by the Express server                            |
| `NODE_ENV`   | Runtime environment; controls the cookie's `secure` option |

Use a strong, private value for `JWT_SECRET`. Do not commit your `.env` file.

### 4. Run the development server

```bash
npm start
```

The current server configuration uses Nodemon and `tsx` to run `src/server.ts`.

### 5. Build the project

```bash
npm run build
```

Compiled files are written to the `dist/` directory.

## API Endpoints

The API uses the `/api` base path.

### Authentication

| Method | Endpoint             | Description                                 | Authentication |
| ------ | -------------------- | ------------------------------------------- | -------------- |
| `POST` | `/api/auth/register` | Create an account and sign in automatically | No             |
| `POST` | `/api/auth/login`    | Sign in using email or username             | No             |
| `POST` | `/api/auth/logout`   | Clear the authentication cookie             | No             |

### Current User

These endpoints operate on the account identified by the access token. They do not accept a user ID in the URL.

| Method   | Endpoint           | Description                       | Authentication |
| -------- | ------------------ | --------------------------------- | -------------- |
| `GET`    | `/api/me`          | Get the current user's profile    | Yes            |
| `PATCH`  | `/api/me/username` | Update username                   | Yes            |
| `PATCH`  | `/api/me/email`    | Update email                      | Yes            |
| `PATCH`  | `/api/me/password` | Change password                   | Yes            |
| `DELETE` | `/api/me`          | Delete the current user's account | Yes            |

## Usage

### Register

**`POST /api/auth/register`**

```json
{
  "username": "gojo",
  "email": "gojo@example.com",
  "password": "your-password"
}
```

A successful registration creates the account and sets the `accessToken` cookie.

### Login

**`POST /api/auth/login`**

Login with an email:

```json
{
  "email": "gojo@example.com",
  "password": "your-password"
}
```

Or login with a username:

```json
{
  "username": "gojo",
  "password": "your-password"
}
```

A successful login sets the `accessToken` cookie.

### Get Current User

**`GET /api/me`**

Send the authentication cookie with the request.

Example response:

```json
{
  "id": "USER_ID",
  "email": "gojo@example.com",
  "username": "gojo"
}
```

### Update Username

**`PATCH /api/me/username`**

```json
{
  "username": "new-username"
}
```

### Update Email

**`PATCH /api/me/email`**

```json
{
  "email": "new-email@example.com"
}
```

### Change Password

**`PATCH /api/me/password`**

```json
{
  "oldPassword": "current-password",
  "newPassword": "new-password"
}
```

The current password must be correct before the password is changed.

### Logout

**`POST /api/auth/logout`**

Clears the `accessToken` cookie from the client.

### Delete Account

**`DELETE /api/me`**

Deletes the currently authenticated user's account and clears the authentication cookie.

## Authentication Flow

1. A user registers or logs in.
2. The server verifies the credentials and creates a JWT.
3. The JWT is sent to the client through an HTTP-only cookie named `accessToken`.
4. Protected routes use the `requireAuth` middleware.
5. The middleware verifies the JWT and attaches its subject to `req.userId`.
6. The route uses `req.userId` to access the authenticated user's account.

The access token expires after **30 minutes**.

## Project Structure

```text
.
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── controllers/
│   │   ├── authentication.controller.ts
│   │   └── users.controller.ts
│   ├── db/
│   │   └── users.ts
│   ├── helpers/
│   │   ├── cookie.helper.ts
│   │   └── jwt.helper.ts
│   ├── middlewares/
│   │   └── middleware.ts
│   ├── router/
│   │   ├── authencation.router.ts
│   │   └── users.router.ts
│   ├── types/
│   │   └── express.d.ts
│   └── server.ts
├── .gitignore
├── nodemon.json
├── package.json
├── package-lock.json
└── tsconfig.json
```

## What I Learned

- Structuring an Express application with controllers, routers, helpers, and middleware
- Handling authentication with JWT
- Hashing and verifying passwords with Argon2
- Managing authentication cookies
- Protecting routes with custom Express middleware
- Working with MongoDB through Mongoose
- Extending Express request types with TypeScript declaration merging
- Using strict TypeScript compiler options

## Current Limitations

This project is still a learning project and is **not production-ready**.

- CORS currently enables credentials without defining an explicit allowed origin.
- MongoDB connection is started without awaiting its completion before the server begins listening.
- Email and username uniqueness are checked in application code, but unique database indexes are not defined in the schema.
- Input validation is basic; there is no dedicated validation layer.
- Logout clears the browser cookie, but does not revoke an already-issued JWT. The token remains valid until it expires.
- There is no refresh-token mechanism.
- The `main` field in `package.json` points to `build/server.js`, while the TypeScript compiler outputs to `dist/`.

## Future Improvements

- Add request validation with Zod or TypeBox
- Configure CORS with an explicit trusted origin
- Wait for MongoDB to connect before accepting requests
- Add unique indexes for email and username
- Add centralized error handling
- Add rate limiting to authentication endpoints
- Implement refresh tokens or server-side token revocation
- Add automated tests
- Improve environment variable validation

## Notes

This repository is part of my journey in learning backend engineering and understanding how REST APIs and authentication systems work.

- Powered By AI
