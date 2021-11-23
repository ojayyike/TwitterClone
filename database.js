const mongoose = require("mongoose");

class Database {
    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect("mongodb+srv://admin:1234@twitterclonecluster.i9h66.mongodb.net/TwitterCloneDB?retryWrites=true&w=majority").then(() => {
            console.log("Database Conncetion Successfull");
        }).catch((err) => {
            console.log("Database Connection Error " + err);
        })
    }
}
//Return an instance of the database class upon call
module.exports = new Database();