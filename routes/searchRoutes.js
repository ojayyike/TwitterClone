const express = require('express')
const app = express();
const port = 3008;
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

//Create a router using the express plugin to handle the login
const router = express.Router();
router.get("/", (req, res, next) => {
    var payload = createPayLoad(req.session.user);
    res.status(200).render("searchPage", payload);
})
router.get("/:selectedTab", (req, res, next) => {
    var payload = createPayLoad(req.session.user);
    payload.selectedTab = req.params.selectedTab;
    res.status(200).render("searchPage", payload);
})
function createPayLoad(userLoggedIn) {
    return {
        pageTitle: "Search",
        userLoggedIn: userLoggedIn,
        userLoggedInJS: JSON.stringify(userLoggedIn),
    }
}
module.exports = router;