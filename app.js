const express = require('express')
const app = express();
const port = 3008;
const middleware = require('./middleware')


const server = app.listen(port, () => console.log("Server Listening on port " + port));

app.set("view engine", "pug");
app.set("views","views")

//Routes
const loginRouter = require('./routes/loginRoutes');
app.use("/login",loginRouter)

app.get("/", middleware.requireLogin, (req, res, next) => {
    
    
    var payload  = {
        pageTitle: "Home"
    }
    res.status(200).render("home",payload)
})