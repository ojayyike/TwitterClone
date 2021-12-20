
const express = require('express')
const app = express();
const port = 3008;
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");
const path = require("path");
//Create a router using the express plugin to handle the login
const router = express.Router();
router.get("/images/:path", (req, res, next) => {
    res.sendFile(path.join(__dirname,"../uploads/images/" + req.params.path));
})

module.exports = router;