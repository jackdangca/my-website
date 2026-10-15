# MyPortfolio — Portfolio Backend & REST APIs

Full-stack portfolio app for Assignment 2. React client  +
Node.js/Express backend connected to MongoDB through Mongoose, with JWT-based
authentication.

## Tech stack

- **Client**: React — runs on `http://localhost:5173`
- **Backend**: Node.js + Express — runs on `http://localhost:5000`
- **Database**: MongoDB (`Portfolio` database) via Mongoose
- **Auth**: JWT (jsonwebtoken) + bcrypt password hashing

## Security notes 

- Connection string and JWT secret live only in `.env` (git-ignored).
- Passwords are hashed; plaintext is never stored or returned.
- API responses never include the `password` field.
- `DELETE /api/...` (remove all) is restricted to admins and intended only for
  controlled testing.
