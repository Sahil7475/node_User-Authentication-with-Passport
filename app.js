require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const expresslayouts = require('express-ejs-layouts');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");

//Passport config
require('./config/passport')(passport);

//EJS
app.use(expresslayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//database connection
mongoose.connect(process.env.DB_URI, { useNewUrlparser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", (error) => console.log("Connected to the database!"));
db.once("open", () => console.log("Connected to the database!"));

//ROUTES
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/user'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port  http://localhost:${PORT}`))
