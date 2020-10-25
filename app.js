//jshint esversion:6

const express = require("express")
const bodyparser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app=express();

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true , useUnifiedTopology: true})
app.use(express.static("public"))
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended: true}));

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema);
app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.post("/register", function(req,res){
    const email=req.body.username
    const password=md5(req.body.password)
    const newUser = new User({
        email: email,
        password: password
    })
    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }
        else{
            console.log(err);
        }
    });
})

app.post("/login",function(req,res){
    const username = req.body.username
    const password= md5(req.body.password)

    User.findOne({email: username},function(err,results){
        if(!err){
            if(results.password===password){
                // console.log(results.password)
                res.render("secrets")
            }
            else{
                res.send("Wrong Email or Password")
            }
        }
        else{
            console.log(results);
            console.log(err)
        }
    })
})














app.listen(3000,function(req,res){
    console.log("Server is running on port 3000");
})