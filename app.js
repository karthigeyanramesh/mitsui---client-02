// As early as possible in your application, import and configure dotenv:

require('dotenv').config()

// SERVER STARTING CODE BELOW

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

// const _ = require("lodash");




const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

console.log(process.env.API_KEY)

main().catch(err => console.log(err));


async function main() {
    mongoose.set('strictQuery', false);
// below i sthe defualt port for mongodb
    mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser: true});

}
// SERVER STARTING CODE ABOVE

// user SCHEMA
const userSchema= new mongoose.Schema({
    email:String,
    password:String

})

// ENCRYPTION-easy way //////////////////////////

// this all we have to do to store the users data encrypted on our DB
// u can still access the users password by using JS CODE(req.body.password)


// to encrpt more ones just add comma after pass and specify the one u need yo encrpt
userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password'] });

// Encryption end ///////////////////////////////

// USER MODEL 

const User = mongoose.model("User",userSchema)

// user DOC






app.get("/",function(req,res){
    res.render("home")
})

app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
    res.render("register")
})

app.get("/logout",function(req,res){
    res.render("home")
})

app.post("/register",function(req,res){
    const email = req.body.username
    const password= req.body.password
    const newUser = new User ({
        email:email,
        password:password

    })
// remember to save DB
    newUser.save(function(err){
        if(!err){
            res.render("secrets")
        }else{console.log(err)}
    })
})

app.post("/login",function(req,res){
    const email = req.body.username
    const password= req.body.password
    User.findOne({ email:email},
        function(err,foundUser){
            console.log(foundUser)
            if(err){console.log(err)

            }else{
                if(foundUser){
                    if(foundUser.password===password){
                        res.render("secrets")
                    }else{console.log("hey brother")}
                }
            }
        }
        )
})




app.listen(3000, function() {
    console.log("Server started on port 30000");
  });