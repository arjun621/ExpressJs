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
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/login", (req, res) =>  {
    res.render("login");
})

app.post("/login", async (req, res) => {
    let {password,email} = req.body;

    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send("Something went wrong");

    bcrypt.compare(password, user.password, (err, result) => {
        if(result) return res.status(200).send("You can login")
        else res.redirect("/login")
    })
})

app.post("/register",async (req, res) => {
    let {name,username,email,password,age} = req.body;

    let user = await userModel.findOne({email});
    if(user) return res.status(500).send("user already exist");

    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(password, salt,async (err, hash) => {
            let user = await userModel.create({
                username,
                age,
                name,
                email,
                password: hash
            })

            let token = jwt.sign({email: email, userid: user._id}, "shhhhh");
            res.cookie("token", token);
            res.render("login");
        })
    })
})

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/login");
})



app.listen(3000);