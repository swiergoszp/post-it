// Express import and set up
const express = require('express');
const app = express();
const path = require('path');

// bodyParser middle-ware set up
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

// CORS middle-ware npm
const cors = require('cors');
app.use(cors());

// Routes
const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

// Mongoose connection
const mongoose = require("mongoose");
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/angularPostApp";
mongoose.Promise = Promise;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Mongo Connection Successful!');
  })
    .catch(() => {
      console.log('Mongo Connection error...');
    });

module.exports = app;
