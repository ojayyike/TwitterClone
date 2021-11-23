const express = require('express')
const app = express();
const port = 3008;
const bodyParser = require("body-parser");
const { render } = require('pug');
//Create a router using the express plugin to handle the register request
const router = express.Router();

app.set("view engine", "pug");
app.set("views","views")
//initialize bodyParser and tell app to use 
app.use(bodyParser.urlencoded({extended: false}));
router.get("/",(req, res, next) => {
    res.status(200).render("register");
})
router.post("/",(req, res, next) => {
    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;
    var payload = req.body; 
    if (firstName && lastName && username && email && password) {
        
    } else {
        payload.errorMessage = "Make sure each field has a valid value";
        res.status(200).render("register",payload);
    }
})

module.exports = router;