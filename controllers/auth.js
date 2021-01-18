const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { verifyRegister } = require("../middlewares");

router.post("/auth/register", [verifyRegister], (req, res) => {
    console.log(req.body);
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });

    user.save((error, user) => {
        console.log(user);
        if (error) {
            return res.status(500).send({ error: error });
        }
        else {
            res.send({ user: user });
        }
    })
});

router.post("/auth/sign-in", (req, res) => {
    User.findOne({
        email: req.body.email
    }).exec((error, user) => {
        if (error != null) {
            return res.status(500).send({ error: error });
        }

        // Couldn't find user with email
        if (!user) {
            return res.status(404).send({ error: "Sorry, your email and/or password is incorrect." })
        }

        // Check password
        let isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Sorry, your email and/or password is incorrect."
            })
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);

        res.status(200).send({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            accessToken: token
        })
    });
});

module.exports = router;