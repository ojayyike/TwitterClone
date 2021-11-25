const express = require('express')
const app = express();
const port = 3008;
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

//Create a router using the express plugin to handle the login
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    if (req.session) {
        req.session.destroy(() => {
            res.redirect("/login");
        })
    }
})
module.exports = router;