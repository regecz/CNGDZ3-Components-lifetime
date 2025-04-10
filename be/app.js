const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const componentRoutes = require('./routes/componentRoutes');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB kapcsolódás
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true // Enable set cookie
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    secure: false, //TODO: Teszteléshez false, amúgy élesben true
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60
  }
}));

// Útvonalak
app.use('/auth', authRoutes);
app.use('/components', componentRoutes);

// Szerver indítása
app.listen(port, () => {
  console.log(`🚀 Szerver fut: http://localhost:${port}`);
});
