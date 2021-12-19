const express = require('express')
const app = express();
const port = 3008;
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

//Create a router using the express plugin to handle the login
const router = express.Router();
router.get("/:id", (req, res, next) => {
    var payload  = {
        pageTitle: "View post",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user),
        postId: req.params.id
    }

    res.status(200).render("postPage",payload);
})

module.exports = router;