const express = require('express')
const app = express();
const port = 3008;
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

//Create a router using the express plugin to handle the login
const router = express.Router();
router.get("/", (req, res, next) => {
    var userLoggedIn = req.session.user;
    var payload = 
        {
        pageTitle: "Inbox",
        userLoggedIn: userLoggedIn,
        userLoggedInJS: JSON.stringify(userLoggedIn)
    }
    res.status(200).render("inboxPage", payload); //Load the pug page 
})

router.get("/new", (req, res, next) => {
    var userLoggedIn = req.session.user;
    var payload = 
        {
        pageTitle: "New Message",
        userLoggedIn: userLoggedIn,
        userLoggedInJS: JSON.stringify(userLoggedIn)
    }
    res.status(200).render("newMessage", payload); //Load the pug page 
})

function createPayLoad(userLoggedIn) {
    return {
        pageTitle: "Inbox",
        userLoggedIn: userLoggedIn,
        userLoggedInJS: JSON.stringify(userLoggedIn),
    }
}
module.exports = router;