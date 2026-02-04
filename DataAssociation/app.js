const express = require('express');
const app = express();
const userModel = require("./models/user.js");
const postModel = require("./models/post.js");

app.get("/", (req, res) => {
    res.send("Hello");
})

app.get("/create", async (req, res) => {
    let user = await userModel.create({
        username: "Arjun",
        email: "arjun@gmail.com",
        age: 21
    })

    res.send(user);
})

app.get("/post/create", async (req, res) => {
    let post = await postModel.create({
        postdata: "This is post data",
        user: "6982fdc8781c919367b5ff86" 
    })

    let user = await userModel.findOne({_id: "6982fdc8781c919367b5ff86"})
    user.post.push(post._id);
    await user.save();

    res.send({post, user});
})

app.listen(3000);