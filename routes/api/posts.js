const express = require('express')
const app = express();
const port = 3008;
const bodyParser = require("body-parser");
const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");

//Create a router using the express plugin to handle the login
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res, next) => {
    var searchObj = req.query; 
    if (searchObj.isReply !== undefined) {
        var isReply = searchObj.isReply == "true";
        searchObj.replyTo = {$exists: isReply}; //Filter based on the replyTo field inside MongoDb database
        delete searchObj.isReply; //Delete the property fron the JS object 
    }
    
    var results = await getPosts(searchObj);
    res.status(200).send(results);
})
router.get("/:id", async (req, res, next) => {
    var postId = req.params.id;
    var postData= await getPosts({_id: postId});
    postData= postData[0]

    var results = {
        postData: postData
    }

    if(postData.replyTo !== undefined) {
        results.replyTo = postData.replyTo;
    }

    results.replies = await getPosts({replyTo: postId});

    res.status(200).send(results);

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

    if (req.body.replyTo) {
        postData.replyTo = req.body.replyTo;
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

router.delete("/:id", async (req, res,next) => {
    Post.findByIdAndDelete(req.params.id)
    .then(() => {
        res.sendStatus(202)
    }).catch(error => {
        console.log(error);
        res.sendStatus(400)
    })
})

async function getPosts(filter) {
    var results = await Post.find(filter)
    .populate("postedBy")
    .populate("retweetData")
    .populate("replyTo")
    .sort({"createdAt": -1})
    .catch(error => {
        console.log(error);
    })
    results = await User.populate(results,{path: "replyTo.postedBy"});
    return  await User.populate(results,{path: "retweetData.postedBy"});
}


module.exports = router;