const express = require('express')
const app = express();
const bodyParser = require("body-parser");
const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");
const Chat = require("../../schemas/ChatSchema");
const Message= require("../../schemas/MessageSchema");

//Create a router using the express plugin to handle the login
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));

router.post("/", async (req, res, next) => {
  if(!req.body.content || !req.body.chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
  }

  var newMessage = {
      sender: req.session.user._id,
      content: req.body.content,
      chat: req.body.chatId
  };

  Message.create(newMessage)
  .then(message=> {
      res.status(201).send(message);
  })
  .catch(error => {
      console.log(error);
      res.sendStatus(400);
  })
})
module.exports = router;