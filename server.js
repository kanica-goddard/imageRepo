// Entry point file 

const express = require("express"); 

const app = express();// create app object by calling the express function

const port = 3000; 
//set up a server by calling the listen method
app.listen(PORT,()=>{
    console.log(`Server is listening`);
})