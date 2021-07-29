const express = require('express');
const path = require('path');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const { v4: uuid } = require('uuid');
const morgan = require('morgan');
// const expressSession = require("express-session");
// const passport = require("passport");

const sessions = [];
const app = express();
const port = process.env.PORT || '3000';

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

// app.use(cors());
// app.use(history({
//   index: "/index.html"
// }));
app.use(express.json({ extended: true }));
app.use(express.urlencoded());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '../webapp/dist')));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use('/api', indexRoute);
app.use('/api', stateRoute);
app.use('/', rootRoute);
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.sendStatus(401);
  let uid = uuid();
  if (username === 'jeremy' && password === 'dunk898') {
    sessions.push(uid);
  }
  res.send(uid);
});
app.post('/valpas', (req, res) => {
  if (req.body.pass === 'flex') {
    return res.sendStatus(200);
  }
  return res.sendStatus(401);
});

app.listen(port, () => {
  console.log('Listening on port %s', port);
});
