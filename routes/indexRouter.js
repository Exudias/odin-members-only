const { Router } = require("express");
const indexController = require("../controllers/indexController");
const passport = require("passport");

const indexRouter = Router();
  
indexRouter.get("/log-in", indexController.loginGet);
indexRouter.get("/log-out", indexController.logoutGet);
indexRouter.get("/register", indexController.registerGet);
indexRouter.get("/newMessage", indexController.newMessageGet);
indexRouter.get("/", indexController.indexGet);

indexRouter.post("/log-in", 
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log-in"
    }
));
indexRouter.post("/register", indexController.registerPost);
indexRouter.post("/newMessage", indexController.newMessagePost);
indexRouter.post("/become-member", indexController.becomeMemberPost);
indexRouter.post('/verify-code', indexController.verifyCodePost);
indexRouter.delete('/messages/:id', indexController.messageDelete);

module.exports = indexRouter;