const express = require('express');
const app = express();
const env = require('dotenv').config();
const mongoose = require('mongoose');
const PORT = 8080;
const user = require('./routes/User');
const election = require('./routes/Election');

//TODO: Add the constants in .env

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
app.use('/users', user);
app.use('/elections', election);

app.get('/',(req, res) => {
    return res.send({"msg" : "We are on home page"})
})

//TODO: Add routes

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log("You are connected to the database"))
.catch((err) => console.log(`There was an error : ${err}`))

app.listen(PORT, () => console.log(`connected to ${PORT}`))