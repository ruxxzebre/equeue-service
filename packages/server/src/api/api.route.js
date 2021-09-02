const { Router } = require('express');

const router = Router();

router.get('/verify', (_, res) => {
    res.send('API connection established.');
})

module.exports = router;
