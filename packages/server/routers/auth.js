const { Router } = require('express');

const router = Router();

// auth
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (req.session.authenticated) {
    return res.json({message: "Fine."});
  } else {
    if (
      username === process.env.ADMIN_LOGIN
      && password === process.env.ADMIN_PASSWORD
    ) {
      req.session.authenticated = true;
      return res.json({message: "Logged."});
    }
  }
  return res.status(401).send({message: "Bad credentials."});
});

router.get('/valid', (req, res) => {
  res.json({ authenticated: !!req.session.authenticated });
});

module.exports = router;
