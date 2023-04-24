const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5000;
require('./db/mongoose');
const user_router = require('./src/user/userRoutes');
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



app.use(user_router);

app.use(express.json());
// app.use(cors())
app.use(express.urlencoded({
    extended: true
}))
app.listen(PORT, (error) =>{
        if(!error)
            console.log("Server is Successfully Running,and App is listening on port "+ PORT)
    else
        console.log("Error occurred, server can't start", error);
    }
);
