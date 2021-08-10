const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
// const expressSession = require("express-session");
// const passport = require("passport");

const sessions = [];
const app = express();
const port = parseFloat(process.env.PORT) || 3000;

/*
https://auth0.com/blog/create-a-simple-and-secure-node-express-app/

const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
};

if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

*/

const indexRoute = require('./routers/index');
const rootRoute = require('./routers/root');
const stateRoute = require('./routers/states');

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
app.use(express.json({ extended: true }));
app.use(express.urlencoded());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '../webapp/dist')));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use('/api', indexRoute);
app.use('/api', stateRoute);
app.use('/', rootRoute);

// localhost:3000 -> serverIP:3000
let firelock = false;

if (!firelock)
  app.listen(port, '0.0.0.0', () => {
    console.log('Listening on port %s', port);
  });

module.exports.app = app;
