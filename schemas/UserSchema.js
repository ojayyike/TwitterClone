const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    username:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email:{ 
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{ 
        type: String,
        required: true,
    },
    profilePic:{ 
        type: String,
        required: true,
        default:"/images/profilePic.png"
    }
},{timestamps: true});

var user = mongoose.model('User',UserSchema)
module.exports = user;