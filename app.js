const express = require('express');
const app = express();
const authRouter = require('./router/authRouter.js');
const databaseConnect = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');


databaseConnect();
app.set('views', './views');

// Set EJS as the default view engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))

app.use('/auth',authRouter);


app.use('/', (req,res)=>{
    res.status(200).render("create");
})

module.exports = app;