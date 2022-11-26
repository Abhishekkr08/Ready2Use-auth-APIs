const express = require('express');
const dotenv = require('dotenv');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');
const { resourceLimits } = require('worker_threads');
const cookieParser = require('cookie-parser');
const routes = require('./src/routes/route')
const auth = require('./src/middleware/auth');
dotenv.config({path:'./.env'})
require('./src/model/db/conn');


const PORT = 3030;
const public_path = path.join(__dirname, './public');
app.use(express.static(public_path)); // for connecting the public folder inside it
app.set("view engine", "hbs");
app.set('views', path.join(__dirname, './views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
     // same as above 


app.use('/', routes) // for redirecting all the requests to the routes folder


app.listen(PORT, () => {
    console.log(`server listening at port ${PORT}`);
})