const express = require('express')
const app = express();
const port = 3008;
const bodyParser = require("body-parser");
const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");

//Create a router using the express plugin to handle the login
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));

router.put("/:userId/follow", async (req, res, next) => {
    var userId = req.params.userId;
    var user = await User.findById(userId);

    if (user == null) {
        return res.sendStatus(404);
    }

    var isFollowing = user.followers && user.followers.includes(req.session.user._id);
    var option = isFollowing ? "$pull" : "$addToSet";

    //insert user follow 
    req.session.user = await User.findByIdAndUpdate(req.session.user._id, {[option]: {following: userId}}, {new: true})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    //Update the followers count of the user being followed 
    User.findByIdAndUpdate(userId, {[option]: {followers: req.session.user._id}})
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    res.status(200).send(req.session.user);
})

module.exports = router;