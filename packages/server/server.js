require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const helmet = require('helmet');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const httpStatus = require('http-status');
const timeout = require('connect-timeout');
const config = require('./config/config');
const morgan = require('./config/morgan');
const xss = require('xss-clean');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const expressSession = require("express-session");
const store = new expressSession.MemoryStore();

const app = express();
const port = process.env.PORT || 3000;

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(xss());
app.use(mongoSanitize());
app.use(compression());

// Security middlewares
app.use(helmet());
app.use(timeout('420s'));

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

if (config.env === 'production') {
  app.use('/api/v2/auth', authLimiter);
}

/*
https://auth0.com/blog/create-a-simple-and-secure-node-express-app/
*/

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

const { routers } = require('./entities');
const indexRoute = require('./routers/index');
const rootRoute = require('./routers/root');
const stateRoute = require('./routers/states');
const authRoute = require('./routers/auth');

app.use('/api/v1', indexRoute);
app.use('/api/v1', stateRoute);
app.use('/api/v1', rootRoute);
app.use('/api/v1/auth', authRoute);

app.use('/api/v2', routers);

// convert error to ApiError, if needed and handle error
app.use(errorConverter);
app.use(errorHandler);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// localhost:3000 -> serverIP:3000
let fireLock = false;

if (!fireLock)
  app.listen(port, '0.0.0.0', () => {
    console.log('Listening on port %s', port);
  });

module.exports.app = app;
