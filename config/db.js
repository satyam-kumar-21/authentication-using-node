const mongoose = require('mongoose');

const MONGO_DB_URL = "mongodb://127.0.0.1:27017/auth";

const databaseConnect = () =>{
    mongoose
    .connect(MONGO_DB_URL)
    .then((conn) =>{
        console.log(`Connected to DB `)
    })
    .catch((err)=>{
        console.log(err.message);
    })
}

module.exports = databaseConnect;