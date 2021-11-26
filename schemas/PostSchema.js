const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content:  {type: String, trim: true},
    postedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    pinned: Boolean
},{timestamps: true});

var posts= mongoose.model('Post',PostSchema);
module.exports = posts;