const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now(),
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now(),
        required: true
    },
    src: {
        type: String,
        required: true
    },
    userAccess: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

//Implementing this model allows you to perform CRUD operations
const imageModel = mongoose.model("Image", imageSchema);
module.exports = imageModel; 