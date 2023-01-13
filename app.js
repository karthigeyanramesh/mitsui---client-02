// As early as possible in your application, import and configure dotenv:

require('dotenv').config()

// SERVER STARTING CODE BELOW

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

// ////HASHING USING BYCRPT- rember to check npm docs
const bcrypt = require('bcrypt');
const saltRounds = 10;



// hasing using MD5

// const md5 = require('md5');


// ///ENCRYPTION METHOD//////
// var encrypt = require('mongoose-encryption');

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



// ////// HASHING /////



// ENCRYPTION-easy way //////////////////////////

// this all we have to do to store the users data encrypted on our DB
// u can still access the users password by using JS CODE(req.body.password)


// to encrpt more ones just add comma after password and specify the one u need yo encrpt

// userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password'] });

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
    // md5 is wrapped around teh password here- thats all u have to do
    const password= req.body.password
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if(!err){
            const newUser = new User ({
                email:email,
                password:hash
        
            })
            // remember to save DB
            newUser.save(function(err){
                if(!err){
                    res.render("secrets")
                }else{console.log(err)}
            })

        }else{console.log(err)}
        
        // Store hash in your password DB.
    });
    
})

app.post("/login",function(req,res){
    const email = req.body.username
    const password= req.body.password


    // DATABASE CROSS CHECK
    User.findOne({ email:email},
        function(err,foundUser){
            console.log(foundUser)
            if(err){console.log(err)

            }else{
                if(foundUser){
                    // /IN ORDER TO CROSS CHECK WITH CYRPT U MUST USE THE COMPARE METHOD////
                    // IN BYCRPT.COMPARE , the first parameter is the pass user enters and th 
                    // 2nd one is the hash in our DB
                    
                    bcrypt.compare(password, foundUser.password, function(err, result) {
                        if(result=== true){
                            res.render("secrets")
                        }

                        
                    });
                    
                    // Below is for md5 and encryption
                    // if(foundUser.password===password){
                    //     res.render("secrets")
                    // }else{console.log("hey brother")}
                }
            }
        }
        )
})




app.listen(3000, function() {
    console.log("Server started on port 30000");
  });