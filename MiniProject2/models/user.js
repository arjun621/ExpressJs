const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/miniproject2");

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    age: Number,
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }]
})

module.exports = mongoose.model("User", userSchema);