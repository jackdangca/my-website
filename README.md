# MyPortfolio

Full-stack React portfolio backed by Express, MongoDB/Mongoose, and JWT
authentication.

- Sign-up, sign-in, and contact forms with client-side validation and
  loading/success/error states
- Administrator-only CRUD for projects, qualifications, and contact records
- JWT access tokens, protected routes, and role-based authorization enforced
  on both client and server
- All portfolio content persisted in MongoDB and served through the REST API

## Run locally

1. Copy `.env.example` to `.env` and set `MONGO_URI`, a strong random
   `JWT_SECRET`, and the administrator email/password. `.env` is ignored by Git.
   The password is supplied only through the environment and is bcrypt-hashed
   by the user model before it is stored.
2. Install all dependencies with one command: `npm run install:all`
   (installs backend and client dependencies; equivalent to
   `npm install --prefix Backend` plus `npm install --prefix client`).
3. Start both applications with a single command from the repository root:
   `npm run dev` — this runs the Express API (nodemon, port 5000) and the
   Vite client (port 5173) concurrently, with prefixed output
   (`[backend]` / `[client]`) in one terminal.
4. Open `http://localhost:5173`. Configure `VITE_API_URL` in
   `client/.env.local` only if the API is not at `http://localhost:5000`.

Repository root scripts (single entry point for both applications):

| Command | Purpose |
| --- | --- |
| `npm run install:all` | Install backend and client dependencies |
| `npm run dev` | Start the Express API (nodemon) and Vite client together with prefixed `[backend]` / `[client]` output |
| `npm run server` | Start only the backend API |
| `npm run client` | Start only the frontend client |
| `npm test` | Run the backend authorization tests (`node --test`) |

The client uses `http://localhost:5173`; the API uses `http://localhost:5000`.
Set `CLIENT_ORIGIN` to a comma-separated list when allowing additional client
origins.

## Project structure

```
Backend/    Express REST API: routes, controllers, Mongoose models,
            JWT auth middleware, validators, and node --test suites
client/     React (Vite) SPA: pages, AuthContext, ProtectedRoute,
            fetch-based API module, Tailwind styling
postman/    Postman collection covering every API route
docs/       Evidence screenshots captured from a live run
.env.example  Template for the required environment configuration
```

## Authentication and authorization

- `POST /api/auth/register` and `POST /api/users` create regular-user accounts;
  both return the same token/user response and never accept a role from the
  request body.
- `POST /api/auth/login` returns an access token; `GET /api/auth/profile`
  validates it.
- The client keeps the token in `sessionStorage` for the current browser
  session and sends it as `Authorization: Bearer <token>`. Signing out removes
  it from the browser.
- Access tokens are stateless JWTs. `POST /api/auth/logout` is informational:
  it does not revoke a copied token, which remains valid until expiration.
  Keep token expiration short enough for the deployment's risk profile and
  protect the signing secret.
- Anyone may submit a contact form. Signed-in users can read contact records;
  only administrators may update or delete contacts. Projects and
  qualifications are publicly readable and only administrators may create,
  update, or delete them. The API enforces these rules independently of the
  client route guard.
- The initial administrator is seeded only when `ADMIN_EMAIL` and
  `ADMIN_PASSWORD` are both configured. Password hashes are never returned by
  the API.

## API routes

| Method | Route | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/users` | Public; regular-user registration |
| GET | `/api/users`, `/api/users/:id` | Signed in |
| PUT | `/api/users/:id` | Signed in; own profile or administrator |
| DELETE | `/api/users...` | Administrator |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Public; client-side token removal |
| GET | `/api/auth/profile` | Signed in |
| GET | `/api/projects`, `/api/projects/:id` | Public |
| POST, PUT, DELETE | `/api/projects...` | Administrator |
| GET | `/api/qualifications`, `/api/qualifications/:id` | Public |
| POST, PUT, DELETE | `/api/qualifications...` | Administrator |
| POST | `/api/contacts` | Public |
| GET | `/api/contacts`, `/api/contacts/:id` | Signed in |
| PUT, DELETE | `/api/contacts...` | Administrator |

Use the `/admin` page after signing in as the configured administrator to
manage contacts, qualifications, and projects. Public project and education
pages read their records from the API; an empty collection displays an empty
state rather than fabricated records.

## API verification and evidence

A complete Postman collection is committed under
`postman/collections/MyPortfolio API/`. It covers registration, login, logout,
profile, and CRUD for projects, qualifications, contacts, and users. Login and
registration requests automatically save their returned token to the
`authToken` collection variable, so protected requests can be run in sequence.

Run the whole collection from the command line with Newman (export the
collection to JSON in Postman first, or point Newman at Postman's local
directory):

1. Start the API (`npm run server` or `npm run dev`).
2. Run the collection and confirm every request returns its expected status:
   reads `200`, creations `201`, requests without a token `401`, and
   regular-user mutations `403`.
3. A full executed run of 24 requests across the Auth, Contacts, Projects,
   Qualifications, and Users folders passed with 0 failures; the HTML report
   and per-request results are captured in `docs/evidence/11-postman-summary.png`
   and `12-postman-all-requests.png`.

Backend unit/integration tests also run with `npm test` from the repository
root: six `node --test` suites covering token rejection, token verification,
admin-versus-user authorization, project completion-date validation, and the
public registration route.

Submission evidence screenshots (sign-up/sign-in, 401 rejection, regular-user
read-only access, administrator CRUD, contact form submission, API responses)
are committed under `docs/evidence/`. None of them contain tokens, passwords,
connection strings, or other secrets.
