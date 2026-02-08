const express = require('express');
const app = express(); 
const userModel = require("./models/user");
const userPost = require("./models/post");
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/profile", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render("profile", { user });
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
    let post = await userPost.findOne({_id: req.params.id }).populate("user");
    res.render("edit", { post });
});

app.post("/update/:id", isLoggedIn, async (req, res) => {
    let post = await userPost.findOneAndUpdate({ _id: req.params.id }, {content: req.body.content});
    res.redirect("/profile");
});

app.get("/delete/:id", isLoggedIn, async (req, res) => {
    let post = await userPost.findOneAndDelete({ _id: req.params.id });
    res.redirect("/profile");
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
    let post = await userPost.findOne({ _id: req.params.id });

    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    } else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }

    await post.save();
    res.redirect("/profile");
});


app.post("/login", async (req, res) => {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email });
    if (!user) return res.redirect("/login");

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = jwt.sign({ email: user.email, userid: user._id },"shhhhh");
            res.cookie("token", token);
            res.redirect("/profile");
        } else {
            res.redirect("/login");
        }
    });
});

app.post("/register", async (req, res) => {
    let { name, username, email, password, age } = req.body;

    let user = await userModel.findOne({ email });
    if (user) return res.send("user already exists");

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                name,
                username,
                email,
                age,
                password: hash
            });

            let token = jwt.sign({ email: user.email, userid: user._id },"shhhhh");
            res.cookie("token", token);
            res.redirect("/profile");
        });
    });
});

app.post("/post", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });

    let post = await userPost.create({
        user: user._id,
        content: req.body.content
    });

    user.posts.push(post._id);   
    await user.save();

    res.redirect("/profile");
});

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/login");
});

function isLoggedIn(req, res, next) {
    if (!req.cookies.token) return res.redirect("/login");

    let data = jwt.verify(req.cookies.token, "shhhhh");
    req.user = data;
    next();
}

app.listen(3000);
