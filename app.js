const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require('cors');
const app = express();
const connectToDb = require('./db/db');

require('./models/userModel');
require('./models/opinionModel');
require('./models/commentModel');

const userRoutes = require('./routes/user.routes');
const opinionRoutes = require('./routes/opinion.routes');
const commentRoutes = require('./routes/comment.routes');
const cookieparser = require('cookie-parser');

connectToDb();

// Use the configured cors middleware
app.use(cors({
	origin: ["https://raw-talks-3p8w-7x9wo997x-logics-projects-e2915aee.vercel.app","https://raw-talks-3p8w.vercel.app","https://raw-talks.vercel.app", "http://localhost:5173"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.get('/', (req, res) => {
  res.send("backend is running");
});

// Mount routes under /api
app.use('/api/users', userRoutes);
app.use('/api/opinions', opinionRoutes);
app.use('/api/comments', commentRoutes);

module.exports = app;
