const express = require('express')
const app = express();
const port = 3008;
const bodyParser = require("body-parser");
const render = require('pug');
const User = require("../schemas/UserSchema")
//Create a router using the express plugin to handle the register request
const router = express.Router();

app.set("view engine", "pug");
app.set("views", "views")
//initialize bodyParser and tell app to use 
app.use(bodyParser.urlencoded({ extended: false }));
router.get("/", (req, res, next) => {
    res.status(200).render("register");
})
router.post("/", async (req, res, next) => {
    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;
    var payload = req.body;
    console.log(payload);
    if (firstName && lastName && username && email && password) {
        console.log(payload);
        var user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
            .catch((error) => {
                console.log(error);
                payload.errorMessage = "Something went wrong.";
                res.status(200).render("register", payload);
            });
        if (user == null) {
            //Create user and pass data into mongoDB
            User.create(payload).then((user) => {
                console.log(user);
            })
        } else {
            if (email == user.email) {
                payload.errorMessage = "Email is already in use";
                res.status(200).render("register", payload);
            } else {
                payload.errorMessage = "Username is already in use";
                res.status(200).render("register", payload);
            }
        }
    } else {
        payload.errorMessage = "Make sure each field has a valid value";
        res.status(200).render("register", payload);
    }
})

module.exports = router;