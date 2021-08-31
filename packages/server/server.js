require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
// const { v4: uuid } = require('uuid');
const expressSession = require("express-session");
const store = new expressSession.MemoryStore();
// const passport = require("passport");

const app = express();
const port = process.env.PORT || 3000;

/*
https://auth0.com/blog/create-a-simple-and-secure-node-express-app/
*/

const indexRoute = require('./routers/index');
const rootRoute = require('./routers/root');
const stateRoute = require('./routers/states');
const authRoute = require('./routers/auth');

const whitelist = ["http://localhost:3000", "http://localhost:8080"];
let development = true;

if (development) {
  app.use(cors({
    origin: "*",
  }));
} else {
  app.use(cors({
    origin: (origin, cb) => {
      if (whitelist.includes(origin)) {
        return cb(null, true);
      }
      cb(new Error());
    },
  }));
}

app.use(expressSession({
  secret: process.env.SESSION_SECRET || "SECRET",
  cookie: {
    maxAge: 30*60*100
  },
  saveUninitialized: false,
  store,
}));
app.use(express.json({ extended: true }));
app.use(express.urlencoded());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, '../webapp/dist')));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use('/api', indexRoute);
app.use('/api', stateRoute);
app.use('/api', rootRoute);
app.use('/api/auth', authRoute);

// localhost:3000 -> serverIP:3000
let fireLock = false;

if (!fireLock)
  app.listen(port, '0.0.0.0', () => {
    console.log('Listening on port %s', port);
  });

module.exports.app = app;
