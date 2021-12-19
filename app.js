const express = require('express')
const app = express();
const port = 3008;
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const server = app.listen(port, () => console.log("Server Listening on port " + port));
const mongoose = require("./database");
const session = require("express-session");
app.set("view engine", "pug");
app.set("views","views")
//Any file stored inside the public folder is served as a public file
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
    secret: "bbq chipsf",
    resave: true,
    saveUninitialized: false
}))
//Routes
const loginRouter = require('./routes/loginRoutes');
const register = require('./routes/registerRoutes');
const logOut = require('./routes/logout');
const postRoute= require('./routes/postRoutes');

//API Routs
const postsApiRouts = require("./routes/api/posts");
const { json } = require('body-parser');

app.use("/login",loginRouter);
app.use("/register",register);
app.use("/logout",logOut);
app.use("/api/posts", postsApiRouts);
app.use("/posts",middleware.requireLogin, postRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {
    
    
    var payload  = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user)
    }
    res.status(200).render("home",payload)
})