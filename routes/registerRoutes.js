const express = require('express')
const app = express();
const port = 3008;
//Create a router using the express plugin to handle the register request
const router = express.Router();

app.set("view engine", "pug");
app.set("views","views")

router.get("/",(req, res, next) => {
    res.status(200).render("register");
})

module.exports = router;