module.exports = {
    login(req, res) {
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
    },
    valid(req, res) {
        res.json({ authenticated: !!req.session.authenticated });
    },
}