const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('./models/user')
const taskModel = require('./models/task')
const cookieParser = require('cookie-parser');
const user = require('./models/user');

const app = express();

app.set("view engine", "ejs");


app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/profile", isLoggedIn,async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email}).populate("tasks");
    res.render("profile", { user })
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/edit-task/:id", isLoggedIn, async (req, res) => {
    let task = await taskModel.findOne({_id: req.params.id }).populate("user");
    res.render("edit", { task });
});

app.post("/update/:id", isLoggedIn, async (req, res) => {
    let task = await taskModel.findOneAndUpdate({ _id: req.params.id }, {title: req.body.title, description: req.body.description});
    res.redirect("/profile");
});

app.get("/delete-task/:id",isLoggedIn, async (req, res) => {
    let task = await taskModel.findOneAndDelete({_id: req.params.id})
    res.redirect("/profile");   
})

app.get("/change-status/:id",isLoggedIn, async (req, res) => {
    let taskId = req.params.id;

    let task = await taskModel.findById(taskId);

    if(!task) return res.send("task not found!");

    if(task.status === "Pending") task.status = "inProgress";
    else if(task.status === "inProgress") task.status = "Completed";
    else task.status = "Pending";

    await task.save();

    res.redirect("/profile");
})


app.post("/register", async (req, res) => {
    let {name, email, password, age, task} = req.body;

    let user = await userModel.findOne({email});
    if(user) return res.send("User already exist");

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                name,
                email,
                age, 
                password:hash
            })
            let token = jwt.sign({ email: user.email, userid: user._id}, "shhhhh");
            res.cookie("token", token);
            res.redirect("/login");
        })
    })
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login",async (req, res) => {
    let {email, password} = req.body;

    let user = await userModel.findOne({email});
    if(!user) return res.redirect("/register");

    bcrypt.compare(password, user.password, (err, result) => {
        if(result) {
            let token = jwt.sign({ email: user.email, userid: user._id}, "shhhhh");
            res.cookie("token", token);
            res.redirect("/profile");
        }
        else {
            res.redirect("/login");
        }
    }) 
})

app.post("/addTask",isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });

    let task = await taskModel.create({
        title: req.body.title,
        description: req.body.description,
        user: user._id
    })
    user.tasks.push(task._id);
    await user.save();

    res.redirect("/profile");
})

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/login");
})

function isLoggedIn (req, res, next) {
    if(!req.cookies.token) return res.redirect("/login");

    let data = jwt.verify(req.cookies.token, "shhhhh");
    req.user = data;
    next();
}


app.listen(3000);


