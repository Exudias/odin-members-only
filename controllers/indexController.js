const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const db = require("../db/queries");
const { body, validationResult } = require('express-validator');
const formatTimestamp = require("../utils/formatTimestamp");
const authorFromUserId = require("../utils/authorFromUserId");

require("dotenv").config();

exports.indexGet = asyncHandler(async (req, res) => {
    const messages = await db.getAllMessages();

    const canSeeDetails = req.user && (req.user.member_status || req.user.admin);

    const formattedMessages = await Promise.all(messages.map(async (msg) => {
        const author = canSeeDetails ? await authorFromUserId(msg.user_id) : "";
        const timestamp = canSeeDetails ? formatTimestamp(msg.timestamp) : "";

        return {
            ...msg,
            author,
            timestamp,
        }
    }));

    res.render("index", { title: "Home", user: req.user, messages: formattedMessages, });
});

exports.loginGet = asyncHandler(async (req, res) => {
    res.render("login", { title: "Login", user: req.user, });
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
    res.render("register", { title: "Register", user: req.user, });
});

exports.registerPost = [
    body('username').isLength({min: 3, max: 255}).withMessage('Username must be between 3 and 255 characters long').trim().escape(),
    body('password').isLength({ min: 6, max: 255 }).withMessage('Password must be between 6 and 255 characters long').trim().escape(),
    body("first_name").isLength({ max: 255}).withMessage('First name must be at most 255 characters long').trim().escape().optional(),
    body("last_name").isLength({ max: 255}).withMessage('Last name must be at most 255 characters long').trim().escape().optional(),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("register", {
                title: "Register",
                user: req.user,
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

exports.newMessageGet = asyncHandler(async (req, res) => {
    if (!req.user)
    {
        return res.redirect("/");
    }
    res.render("newMessage", { title: "Post a message", user: req.user, });
});

exports.newMessagePost = [
    body('title').isLength({min: 1, max: 255}).withMessage('Title must be between 1 and 255 characters long').trim().escape(),
    body('text').notEmpty().withMessage("Message body must not be empty").trim().escape(),

    asyncHandler(async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("newMessage", {
                title: "Post a message",
                user: req.user,
                errors: errors.array(),
            });
        }

        try
        {
            await pool.query(
                "INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)", 
                [
                    req.body.title,
                    req.body.text,
                    req.user.id,
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

exports.becomeMemberPost = asyncHandler(async (req, res) => {
    const code = req.body.code;

    if (!req.user)
    {
        return res.json({ success: false });
    }

    if (code === process.env.SECRET_CODE)
    {
        await pool.query(
            "UPDATE users SET member_status = TRUE WHERE id = $1", 
            [
                req.user.id,
            ]
        );
        return res.json({ success: true });
    }
    
    res.json({ success: false });
});

exports.verifyCodePost = asyncHandler(async (req, res) => {
    const { code } = req.body;

    if (code === process.env.SECRET_CODE) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

exports.messageDelete = asyncHandler(async (req, res) => {
    const id = req.params.id;

    try 
    {
        await pool.query("DELETE FROM messages WHERE id = $1", [id]);
        res.status(200).send('Message deleted');
    }
    catch (error) 
    {
        console.error('Error deleting message:', error);
        res.status(500).send('Failed to delete message');
    }
});