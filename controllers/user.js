const express = require('express')
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

// Create new user
router.post("/user", (req, res) => {
    console.log(req.body);
    userModel.countDocuments({ email: req.body.email }).then(count => {
        if (count > 0) {
            // email already exists, cannot create new user
            res.status(409).json({ error: "Email already in use." });
        }
        else {
            //Build object
            const newUser = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
            }

            //Save user model
            const user = new userModel(newUser);
            user.save()
                .then((user) => {
                    res.json(user);
                })
        }

    })
})

//Route to process user's request and data when user submits signin form
router.post("/auth", (req, res) => {
    console.log(req.body);
    userModel.findOne({ email: req.body.email })
        .then(user => {
            //Email not found
            if (user == null) {
                res.status(404).json({ error: "Sorry, your email and/or password is incorrect" });
            }
            //Email is found
            else {
                bcrypt.compare(req.body.password, user.password)
                    .then(isMatched => {
                        if (isMatched) {
                            //Create session
                            req.session.userInfo = user;

                            res.json({});

                            // res.cookie('name', 'user', {
                            //     httpOnly: true,
                            //     signed: true,
                            // }).send();

                        }
                        else {
                            res.status(404).send("Sorry, your email and/or password is incorrect");
                        }
                    })
                    .catch(err => console.log(`Error ${err}`));
            }
        })
        .catch(err => console.log(`Error ${err}`));
})

router.get("/signout", (req, res) => {

    req.session.destroy();
    res.send({
        user: null
    })

})
module.exports = router;
