const express = require("express");
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mongoose = require("mongoose");
const cors = require('cors');
const session = require('express-session');

//Loads environment variables from the keys.env
require("dotenv").config({ path: "./config/keys.env" });

//App object
const app = express();

//Middleware 
app.use(bodyParser.urlencoded({ extended: false })); //bodyparser middleware
app.use(cors());
app.use(fileUpload());
app.use(express.static('public')); // Serve public folder 
app.use(session({
    secret: `${process.env.SECRET_KEY}`,
    resave: false,
    saveUninitialized: true,
  }))


//Load controllers
const generalController = require("./controllers/general");
const imageController = require("./controllers/image");

//Map each controller to the app express object
app.use("/", generalController);
app.use("/", imageController);

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log(`Connected to MongoDB database`);
    })
    .catch((err) =>
        console.log(`Error occured when connecting to database ${err}`)
    );

const PORT = process.env.PORT;
//Set up a server by calling the listen method
app.listen(PORT, () => {
    console.log(`Your web server has been connected to port ${PORT}.`);
});
