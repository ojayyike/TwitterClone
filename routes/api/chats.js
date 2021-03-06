const express = require('express')
const app = express();
const port = 3008;
const bodyParser = require("body-parser");
const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");
const Chat = require("../../schemas/ChatSchema");

//Create a router using the express plugin to handle the login
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));

router.post("/", async (req, res, next) => {
    if (!req.body.users) {
        console.log("Users params not sent with request")
        return res.sendStatus(400)
    }
    var users = JSON.parse(req.body.users)
    
    if (users.length == 0) {
        console.log("Users array is empty")
        return res.sendStatus(400)
    }

    users.push(req.session.user)
    var chatData = {
        users: users,
        isGroupChat: true
    }
    Chat.create(chatData)
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error)
        res.sendStatus(400)
    })
})

router.get("/", async (req, res, next) => {
    Chat.find({users: {$elemMatch: { $eq: req.session.user._id}}}) //Find on users property that has element match = userloggedin id
    .populate("users")
    .sort({updatedAt: -1})
    .then(results => {
        res.status(200).send(results)
    }).catch(error => {
        console.log(error)
        res.sendStatus(400)
    })
})

router.get("/:chatId", async (req, res, next) => {
    Chat.findOne( { _id: req.params.chatId, users: {$elemMatch: { $eq: req.session.user._id}}}) //Find on users property that has element match = userloggedin id
    .populate("users")
    .then(results => {
        res.status(200).send(results)
    }).catch(error => {
        console.log(error)
        res.sendStatus(400)
    })
})

router.put("/:chatId", async (req, res, next) => {
    Chat.findByIdAndUpdate(req.params.chatId, req.body) //Find on users property that has element match = userloggedin id
    .then(results => {
        res.sendStatus(204)
    }).catch(error => {
        console.log(error)
        res.sendStatus(400)
    })
})
module.exports = router;