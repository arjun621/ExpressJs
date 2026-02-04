const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/testdata")

let userSchema = mongoose.Schema({
    username: String,
    email: String,
    age: Number,
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ]
})

module.exports = mongoose.model("user", userSchema);