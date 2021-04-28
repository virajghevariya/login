const colors = require('colors');
const express = require("express");
const dotenv = require("dotenv");
const router = express.Router();
const app = express();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const expressEjsLayout = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require('passport');
require("./config/passport")(passport);

// Load env var
dotenv.config({ path: "./config/config.env" });

// Connect to Database
connectDB();

//EJS
app.set("view engine", "ejs");
app.use(expressEjsLayout);

//BodyParser
app.use(express.urlencoded({ extended: false }));

//express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//use flash
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

app.listen(3000,console.log(`Server is running in ${process.env.NODE_ENV} on port: ${process.env.PORT}`.blue.inverse));
