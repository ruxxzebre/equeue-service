const express = require('express');
const path = require('path');
const cors = require('cors');
// const expressSession = require("express-session");
// const passport = require("passport");

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

app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, '../webapp/dist')));

app.use('/api', indexRoute);
app.use('/', rootRoute);

app.listen(port, () => {
  console.log('Listening on port %s', port);
});
