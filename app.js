const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;

const indexRouter = require("./routes/indexRouter");

require("dotenv").config();

const app = express();
app.set("view engine", "ejs");

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Express app listening on port ${PORT}!`));
