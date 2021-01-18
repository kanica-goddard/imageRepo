const express = require("express");
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

//Loads environment variables from the keys.env
require("dotenv").config({ path: "./config/keys.env" });

//App object
const app = express();

//Middleware 
app.use(bodyParser.urlencoded({ extended: false })); //bodyparser middleware
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use(cookieParser('82e4e438a0305cabf61f9354e3b535af'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Serve images
app.use(express.static('public'));

//Load controllers
const generalController = require("./controllers/general");
const authController = require("./controllers/auth");
const userController = require("./controllers/user");
const imageController = require("./controllers/image");

app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

// Map each controller to the app express object
app.use("/", generalController);
app.use("/", authController);
app.use("/", userController);
app.use("/", imageController);

// Catchall to send index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

// Connect to MongoDB
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
