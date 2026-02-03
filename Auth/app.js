const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


app.use(cookieParser());

// app.get("/", (req,res) => {
//     res.cookie("name", "arjun");                 ////////setting cookie
//     res.send("done");
// })

// app.get("/", (req, res) => {
//     bcrypt.genSalt(10, function(err, salt) {
//         bcrypt.hash("abcdefg", salt, function(err, hash) {  //////// password encryption
//             console.log(hash);
            
//         })
//     })
// })

// app.get("/view", (req, res) => {
//     bcrypt.compare("abcdefg","$2b$10$00fYbnSxE5YJKgzB12Vw7eBhTy2KpyCXJduRbiCcKQagXh8CD04FW", function(err,result){
//         console.log(result);                     ////////// password decryption
//     })
// })


app.get("/", (req, res) => {
    let token = jwt.sign({email: "arjun@gmail.com"}, "secret");
    res.cookie("token", token);                                 /////////// encrypting data to token
    res.send("done");
})

app.get("/read", (req, res) => {
    let data = jwt.verify(req.cookies.token, "secret");        ////////// decrypting data from token
    console.log(data);
})


app.listen(3000);







