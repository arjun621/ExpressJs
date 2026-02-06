const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title: String,
    description: String,
    status: {
        type: String,
        enum: ["Pending", "inProgress", "Completed"],
        default: "Pending"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("task", taskSchema);