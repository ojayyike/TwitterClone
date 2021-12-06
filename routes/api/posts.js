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
    Post.find()
    .populate("postedBy")
    .sort({"createdAt": -1})
    .then((results) => {
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
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
router.put("/:id/like", async (req, res, next) => {
    var postId = req.params.id;
    var userId = req.session.user._id;

    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);
    var option = isLiked ? "$pull" : "$addToSet";
    //insert user like into the likes array with te addtoSet variable 
    //Use an await keywords because this is an async functions
    //Return the newly updated user and store it into a session 
    req.session.user = await User.findByIdAndUpdate(userId, {[option]: {likes: postId}}, {new: true}).catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    //insert post like 
    var post = await Post.findByIdAndUpdate(postId, {[option]: {likes: userId}}, {new: true}).catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    //res.status(200).send("Yahoo!!")

    res.status(200).send(post);
})

router.post("/:id/retweet", async (req, res, next) => {
    var postId = req.params.id;
    var userId = req.session.user._id;

    //Try and delete retweet
    var deletedPost = await Post.findOneAndDelete({postedBy: userId, retweetData: postId}).catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    var option = deletedPost != null ? "$pull" : "$addToSet";
    var repost = deletedPost;
    if (repost == null) {
        repost = await Post.create({postedBy: userId, retweetData: postId}).catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
    } 
    //Add repost to users list of retweets or remove it 
    req.session.user = await User.findByIdAndUpdate(userId, {[option]: {retweets: repost._id}}, {new: true}).catch(error => {
        console.log(error);
        res.sendStatus(400);
    })

    //insert post like 
    var post = await Post.findByIdAndUpdate(postId, {[option]: {retweetUsers: userId}}, {new: true}).catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
    //res.status(200).send("Yahoo!!")

    res.status(200).send(post);
})
module.exports = router;