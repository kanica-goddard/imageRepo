const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    type: {
        type: String,
        default: "User"
    }
});

userSchema.pre("save", function (next) {
    //salt
    bcrypt.genSalt(10)
        .then((salt) => {
            bcrypt.hash(this.password, salt)
                .then((encryptPassword) => {
                    this.password = encryptPassword;
                    next();
                })
                .catch(err => console.log(`Error occured while hashing ${err}`));
        })
        .catch(err => console.log(`Error occured while salting ${err}`));
})

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;