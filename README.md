# MyPortfolio

Full-stack React portfolio backed by Express, MongoDB/Mongoose, and JWT
authentication.

## Run locally

1. Copy `.env.example` to `.env` and set `MONGO_URI`, a strong random
   `JWT_SECRET`, and the administrator email/password. `.env` is ignored by Git.
   The password is supplied only through the environment and is bcrypt-hashed
   by the user model before it is stored.
2. Install backend dependencies with `npm install --prefix Backend`.
3. Install client dependencies with `npm install --prefix client`.
4. Start both applications with `npm run dev --prefix Backend`.
5. Open `http://localhost:5173`. Configure `VITE_API_URL` in
   `client/.env.local` only if the API is not at `http://localhost:5000`.

Run the backend authorization tests with `npm test --prefix Backend`.

The client uses `http://localhost:5173`; the API uses `http://localhost:5000`.
Set `CLIENT_ORIGIN` to a comma-separated list when allowing additional client
origins.

## Authentication and authorization

- `POST /api/auth/register` creates regular-user accounts; the role is never
  accepted from the request body.
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

Verify with Postman (or another API client): register a regular user; log in as
that user and save its token; confirm reads work and mutations return `403`;
log in as the administrator and confirm create/read/update/delete; submit the
contact form and confirm its record appears in the authenticated contacts
list. Requests to protected routes without a token must return `401`.

For submission evidence, capture actual screenshots from your local run showing
successful sign-up/sign-in, a rejected unauthorized mutation, administrator
CRUD in `/admin`, regular-user read-only access, the contact submission
success state, API responses, and the matching MongoDB documents. Do not include
tokens, passwords, MongoDB connection strings, or other secrets in screenshots.
