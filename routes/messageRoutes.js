const express = require('express')
const app = express();
const port = 3008;
const bodyParser = require("body-parser");
const mongoose= require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");
const Chat = require("../schemas/ChatSchema");

//Create a router using the express plugin to handle the login
const router = express.Router();
router.get("/", (req, res, next) => {
    var userLoggedIn = req.session.user;
    var payload = 
        {
        pageTitle: "Inbox",
        userLoggedIn: userLoggedIn,
        userLoggedInJS: JSON.stringify(userLoggedIn)
    }
    res.status(200).render("inboxPage", payload); //Load the pug page 
})

router.get("/new", (req, res, next) => {
    var userLoggedIn = req.session.user;
    var payload = 
        {
        pageTitle: "New Message",
        userLoggedIn: userLoggedIn,
        userLoggedInJS: JSON.stringify(userLoggedIn)
    }
    res.status(200).render("newMessage", payload); //Load the pug page 
})

router.get("/:chatId", async (req, res, next) => {
    var userId = req.session.user._id
    var chatId = req.params.chatId 
    var isValidId= mongoose.isValidObjectId(chatId)
    var chat = await Chat.findOne({_id: chatId, users: {$elemMatch: {$eq: userId}}}) 
    .populate("users");

    var payload = 
        {
        pageTitle: "Chat",
        userLoggedIn: userLoggedIn,
        userLoggedInJS: JSON.stringify(userLoggedIn),
    }

    if (!isValidId) {

        payload.errorMessage = "Chat does not exist or you do not have perrmission to view this message"
        return res.status(200).render("chatPage", payload); //Load the pug page 
    }

    if (chat == null) {
        //Check if chat id is really user ID
        var userFound = await User.findById(chatId);
        chat = await getChatByUserId(userFound._id, userId)
        if (userFound != null) {
        }
    } 
    
    if (chat == null) {
        payload.errorMessage = "Chat does not exist or you do not have perrmission to view this message"
    } else {
        payload.chat = chat;
    }


    var userLoggedIn = req.session.user;
    res.status(200).render("chatPage", payload); //Load the pug page 
})

function getChatByUserId(userLoggedInId, otherUserId) {
    return Chat.findOneAndUpdate({
        isGroupChat: false,
        users: {
            $size: 2,
            $all: [
                {$elemMatch: {$eq: mongoose.Types.ObjectId(userLoggedInId)}},
                {$elemMatch: {$eq: mongoose.Types.ObjectId(otherUserId)}}

            ]
        }
    }, {
        $setOnInsert: {
            users: [userLoggedInId, otherUserId]
        }
    }, {
        new: true,
        upsert: true //Create the row if you do nnot find anything
    })
    .populate("users")
}

module.exports = router;