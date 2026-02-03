const express = require('express');
const app = express();

const userModel = require("./usermodel");

app.get("/", (req,res) => {
    res.send("hey");
})

app.get("/create", async (req,res) => {
    let createuser = await userModel.create({
        name: "Arjun",
        username: "Arjun123",
        email: "arjun@gmail.com"    
    });

    res.send(createuser);
})

app.get("/read", async (req,res) => {
    let readuser = await userModel.find({username: "Arjun123"});
    res.send(readuser);
})

app.get("/update", async (req,res) => {
    let updateuser = await userModel.findOneAndUpdate({username: "Arjun123"}, {name: "Arjun Parashar"}, {new: true});
    res.send(updateuser);
})

app.get("/delete", async (req,res) => {
    let deleteuser = await userModel.findOneAndDelete({username: "Arjun123"});
    res.send(deleteuser);
})

app.listen(3000);
