const express = require('express')
const app = express();
const port = 3008;
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

//Create a router using the express plugin to handle the login
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "pug");
app.set("views", "views")
router.get("/", (req, res, next) => {
    res.status(200).render("login");
})
router.post("/", async (req, res, next) => {
    var payload = req.body;
    if (req.body.logUsername && req.body.logPassword) {
        var user = await User.findOne({
            $or: [
                { username: req.body.logUsername },
                { password: req.body.logPassword }
            ]
        }).catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render("login", payload);
        });
        if (user != null) {
            //Check the password hash of the user
            var result = await bcrypt.compare(req.body.logPassword, user.password);
            if (result === true) {

                req.session.user = user;
                return res.redirect("/");
            }
        }
            payload.errorMessage = "Login Credentials Incorrect.";
            res.status(200).render("login", payload);
    }
    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).render("login");
})

module.exports = router;