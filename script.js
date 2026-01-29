const express = require('express');
const app = express();

app.use(function(req,res,next){
    console.log("Middleware 1");            // Middleware
    next();
})

app.use(function(req,res,next){
    console.log("Middleware 2");
    next();
})
                                            // Routing 
app.get("/",function(req,res){
    res.send("Hello world");
})

app.get("/profile",function(req,res,next){
    // res.send("This is profile page");
    return next(new error("Not implemented"));
})

app.use((err, req, res, next) => {
  console.error(err.stack)                  //Error handling
  res.status(500).send('Something broke!')
})


app.listen(3000);