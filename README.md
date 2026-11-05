# BASIC OF REST API

A basic REST API built with Express.js, TypeScript, and MongoDB. This project includes user registration, login, session-based authentication, and protected user management endpoints.

---

## Project Status

🟡 In Development

---

## Why I Built This

This project was built to learn the fundamentals of REST API development, authentication, middleware, and database integration using Node.js and TypeScript.

---

## Features

- User registration
- User login
- Password hashing with Node.js crypto
- Random salt generation
- Session token generation
- Cookie-based authentication
- Authentication middleware
- Owner authorization for user-specific operations
- Get all users
- Update username
- Delete user
- MongoDB integration with Mongoose
- TypeScript strict mode

---

## Tech Stack

- Node.js
- TypeScript (ES Modules)
- Express.js
- MongoDB
- Mongoose
- Nodemon
- tsx
- dotenv
- cookie-parser
- cors
- compression
- body-parser
- lodash

---

## Installation

```bash
git clone https://github.com/GoJoMc/BASIC-OF-REST-API.git

cd BASIC-OF-REST-API

npm install
```

Create a `.env` file in the project root:

```env
MONGO_URL=your_mongodb_connection_string
```

Start the development server:

```bash
npm start
```

The server runs at:

```text
http://localhost:8080
```

The current `start` script uses Nodemon and runs the TypeScript entry point through `tsx`.

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in and create a session |

### Users

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| GET | `/users` | Get all users | Authenticated |
| PATCH | `/users/:id/username` | Update a user's username | Owner only |
| DELETE | `/users/:id` | Delete a user | Owner only |

Protected endpoints require the `BevVan-auth` session cookie created during login. User-specific update and delete operations also check that the authenticated user's ID matches the requested ID.

---

## Usage

### Register

Send a POST request to `/auth/register`:

```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "your-password"
}
```

A successful registration returns:

```json
{
  "message": "User created successfully"
}
```

### Login

Send a POST request to `/auth/login`:

```json
{
  "email": "john@example.com",
  "password": "your-password"
}
```

A successful login sets the `BevVan-auth` cookie and returns a session token in the response body.

### Get All Users

Send a GET request to `/users` with the session cookie.

### Update Username

Send a PATCH request to `/users/:id/username`:

```json
{
  "username": "New Username"
}
```

### Delete User

Send a DELETE request to `/users/:id` with the session cookie. The authenticated user can only modify or delete their own account through these routes.

---

## Project Structure

```text
BASIC-OF-REST-API/
├── .gitignore
├── nodemon.json
├── package-lock.json
├── package.json
├── tsconfig.json
└── src/
    ├── controllers/
    │   ├── authentication.controller.ts
    │   └── users.controller.ts
    ├── db/
    │   └── users.ts
    ├── helpers/
    │   ├── authentication.helper.ts
    │   └── random.ts
    ├── middlewares/
    │   └── middleware.ts
    ├── router/
    │   ├── authencation.router.ts
    │   ├── router.ts
    │   └── users.router.ts
    └── server.ts
```

---

## What I Learned

- REST API fundamentals
- Express.js routing and controllers
- Middleware execution
- Authentication and authorization
- Cookie-based sessions
- MongoDB integration with Mongoose
- Password hashing concepts
- TypeScript with Node.js
- Environment variable management
- Separating routes, controllers, helpers, and database logic

---

## Current Limitations

- The authentication secret is hardcoded in the source code.
- The current password hashing approach is a learning implementation, not a production-ready password hashing solution.
- Authentication cookies do not yet configure security options such as `httpOnly`, `secure`, and `sameSite`.
- Session tokens do not currently have an expiration or refresh mechanism.
- Request validation is limited to basic required-field checks.
- There is no logout endpoint yet.
- The current build script references `tsconfig.build.json`, which is not present in the repository.

---

## Future Improvements

- Move authentication secrets into environment variables.
- Use a dedicated password hashing algorithm such as Argon2 or bcrypt.
- Configure secure cookie options.
- Add session expiration and logout functionality.
- Add request validation and consistent error handling.
- Add pagination to the users endpoint.
- Add tests for controllers, middleware, and database operations.
- Fix and verify the production build configuration.

---

## GoJo Notes

This repository is part of my backend engineering journey.

I use every project to strengthen my understanding of backend concepts through hands-on implementation and experimentation.





- Powered By AI
