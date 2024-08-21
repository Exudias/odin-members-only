const express = require("express");
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const passport = require("passport");
const expressLayouts = require('express-ejs-layouts');
const path = require("node:path");

const indexRouter = require("./routes/indexRouter");

const pool = require("./db/pool");

require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(expressLayouts);

const sessionStore = new pgSession({
    pool,
    createTableIfMissing: true,
})

app.use(session({ 
    store: sessionStore,
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false,
    cookie: { 
        maxAge: 30 * 24 * 60 * 60 * 1000 
    },
}));

app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

require("./config/passport");

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Express app listening on port ${PORT}!`));
