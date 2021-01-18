const jwt = require("jsonwebtoken");
const User = require("../models/user");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ error: "No token provided." });
    }

    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if (error) {
            return res.status(401).send({ error: "Unauthorized." });
        }

        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;