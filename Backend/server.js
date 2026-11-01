const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { seedAdmin } = require('./controllers/authController');

const app = express();

// ---- Middleware ----
// Enable CORS so the React client (http://localhost:5173) can call this API.
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// ---- Welcome route ----
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the MyPortfolio API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      contacts: '/api/contacts',
      projects: '/api/projects',
      qualifications: '/api/qualifications',
      users: '/api/users',
    },
  });
});

// ---- API routes ----
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/qualifications', require('./routes/qualificationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// ---- Error handling ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET must be set in the environment before starting the API.');
  process.exit(1);
}

connectDB().then(async () => {
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`\n✅ MyPortfolio backend running on port ${PORT}`);
    console.log(`   http://localhost:${PORT}`);
    console.log('   MongoDB connection: see config/db.js\n');
  });
});
