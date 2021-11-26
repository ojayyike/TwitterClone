const express = require('express')
const app = express();
const port = 3008;
const bodyParser = require("body-parser");
const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");

//Create a router using the express plugin to handle the login
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {

})
router.post("/", async (req, res, next) => {
    if (!req.body.content)  {
        console.log("Context param not sent with request");
        return res.sendStatus(400);
    }
    var postData = {
        content: req.body.content,
        postedBy: req.session.user
    } 
    Post.create(postData)
    .then(async (newPost) => {
        newPost = await User.populate(newPost, {path: "postedBy"})
        res.status(201).send(newPost);
    })
    .catch((err) => {
        console.log(err);
        res.sendStatus(400);
    })
   // res.status(200).send("It worked");
})

module.exports = router;