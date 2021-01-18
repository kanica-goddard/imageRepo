const User = require("../models/user");

const checkEmailExists = (req, res, next) => {
    User.countDocuments({ email: req.body.email }).exec((error, count) => {
        if (error) {
            res.status(500).send({ error: error });
            return;
        }

        if (count > 0) {
            res.status(400).send({ error: "Email address already in use." });
            return;
        }
    });

    next();
}

module.exports = checkEmailExists;