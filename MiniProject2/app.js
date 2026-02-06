const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('./models/user')
const cookieParser = require('cookie-parser');
const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req, res) => {
    res.render("index");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", async (req, res) => {
    let {name, email, password, age, task} = req.body;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            let user = await userModel.create({
                name,
                email,
                age, 
                password:hash
            })
            res.redirect("/login");
        })
    })

})

app.get("/login", (req, res) => {
    res.render("login");
})


app.listen(3000);


// steps from token creation in register route