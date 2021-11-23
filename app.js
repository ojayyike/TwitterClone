const express = require('express')
const app = express();
const port = 3008;


const server = app.listen(port, () => console.log("Server Listening on port " + port));