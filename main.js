// imports 
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const session=require ('express-session');

const app = express();
const port = process.env.port || 4000;

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
  }).then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({secret:"my secret key",
    saveUninitialized:true,
    resave:false,
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message || null;
    delete req.session.message;
    next();
});

app.use('/uploads', express.static('uploads'));



//set template engine
app.set("view engine", "ejs");


// route prefix 
app.use("",require("./routes/routes")); 

const authRoutes = require('./routes/authRoutes');
app.use('/login', authRoutes); // mount auth routes



app.listen( port,() => {
    console.log(`server started at http://localhost:${port}`);
    
});