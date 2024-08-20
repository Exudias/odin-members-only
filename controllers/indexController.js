const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const { body, validationResult } = require('express-validator');

exports.indexGet = asyncHandler(async (req, res) => {
    res.render("index", { title: "Home page", user: req.user });
});

exports.loginGet = asyncHandler(async (req, res) => {
    res.render("login", { title: "Login page" });
});

exports.logoutGet = asyncHandler(async (req, res) => {
    req.logout((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
    });
});

exports.registerGet = asyncHandler(async (req, res) => {
    res.render("register", { title: "Register page" });
});

exports.registerPost = [

    body('username').isLength({min: 3, max: 255}).withMessage('Username must be between 3 and 255 characters long').trim().escape(),
    body('password').isLength({ min: 6, max: 255 }).withMessage('Password must be between 6 and 255 characters long').trim().escape(),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("register", {
                title: "Register",
                errors: errors.array(),
            });
        }

        try
        {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            await pool.query(
                "INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4)", 
                [
                    req.body.username,
                    hashedPassword,
                    req.body.first_name,
                    req.body.last_name,
                ]
            );
            
            res.redirect("/");
        }
        catch(err)
        {
            return next(err);
        }
})
];