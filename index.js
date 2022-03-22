const express = require('express');
const app = express();
const env = require('dotenv').config();
const mongoose = require('mongoose');
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended : true}));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=> console.log("You are connected to the database"))
.catch((err) => console.log(`There was an error : ${err}`))

app.listen(PORT, () => console.log(`connected to ${PORT}`))