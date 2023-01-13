// As early as possible in your application, import and configure dotenv:

require('dotenv').config()

// SERVER STARTING CODE BELOW

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// passport.js packages 
const session = require('express-session');
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")



// ////HASHING USING BYCRPT- rember to check npm docs //////////////////
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// *using mongooselocalpassport enables the password to be hashed and salted automatically


// hasing using MD5 ///////////////////////////////////////////

// const md5 = require('md5');


// ///ENCRYPTION METHOD///////////////////////////////////////////////////
// var encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// /////// passport.js starting code below
app.use(session({
    secret:"our little secret.",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

// /////// passport.js above 


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

// Below code is to hash and salt the users password stored in our mongodb DB-cookie
userSchema.plugin(passportLocalMongoose);

// above code is to hash and salt the users password stored in our mongodb DB-cookie


// ////// HASHING /////



// ENCRYPTION-easy way //////////////////////////

// this all we have to do to store the users data encrypted on our DB
// u can still access the users password by using JS CODE(req.body.password)


// to encrpt more ones just add comma after password and specify the one u need yo encrpt

// userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password'] });

// Encryption end ///////////////////////////////

// USER MODEL 

const User = mongoose.model("User",userSchema)

// since we are using passs-local-mongoose  we only need the 3 lines of code BELOW THE DB MODEL
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/secrets",function(req,res){
    console.log("secrets page")

    // *****IMP NOTE- below we are checking the cookie data wether the user is authenticated
    // already and only then we atre sending the secrets page. This is to reduce the hassle
    // of the user login in twice.THIS IS WHY MONGOOSE-PASSPORT-LOCAL PLAYS A HUGE ROLE
    if(req.isAuthenticated()){
            // In words the above code is "is authentciation required?"

        res.render("secrets")

        
    }else{
        console.log("soryyyyyyyyyyy")

        res.redirect("/login")
    }
})

app.get("/logout",function(req,res){
    // Here we will deAuthenticate the user 
    req.logout()
    res.redirect("/")
})

app.post("/register",function(req,res){

    const email = req.body.username
    // // md5 is wrapped around teh password here- thats all u have to do
    const password= req.body.password
    // saving to  ou DB BELOW- (check npm docs if want - https://www.npmjs.com/package/passport-local-mongoose)
    User.register({username:email},password,function(err,user){
        if(err){
            console.log(err)
            res.redirect("/register")

        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets")
            })
        }
    })
})

    // bcrypt.hash(password, saltRounds, function(err, hash) {
    //     if(!err){
    //         const newUser = new User ({
    //             email:email,
    //             password:hash
        
    //         })
    //         // remember to save DB- until above the newUser doc is not saved
    //         newUser.save(function(err){
    //             if(!err){
    //                 res.render("secrets")
    //             }else{console.log(err)}
    //         })

    //     }else{console.log(err)}
        
    //     // Store hash in your password DB.
    // });
    

app.post("/login",function(req,res){
    
    const email = req.body.username
    const password= req.body.password
    // Creating a JS object for the data the user has entered. Remeber we are not saving the 
    // doc to our DB. What your thinking is "then why we are typing new User", its becuse 
    // new User will only generate a brand new js object according to the userSchema. not save

    const user = new User({
        username:email,
        password:password

    })
    // below refer password.js doc(req.login)
    // first para is the user object. This user object will be cross checked aginst DB 
    // WITH THE HELP OF AUTHENTICATE
    req.login(user,function(err){
        if(err){
            
            console.log(err)
            res.redirect("/login")
        }else{
            console.log("im waiting")

            // below code
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets")
            })

        }

    })
   

        
        
        }
    )


    // // DATABASE CROSS CHECK
    // User.findOne({ email:email},
    //     function(err,foundUser){
    //         console.log(foundUser)
    //         if(err){console.log(err)

    //         }else{
    //             if(foundUser){
    //                 // /IN ORDER TO CROSS CHECK WITH CYRPT U MUST USE THE COMPARE METHOD////
    //                 // IN BYCRPT.COMPARE , the first parameter is the pass user enters and th 
    //                 // 2nd one is the hash in our DB
                    
    //                 bcrypt.compare(password, foundUser.password, function(err, result) {
    //                     if(result=== true){
    //                         res.render("secrets")
    //                     }

                        
    //                 });
                    
    //                 // Below is for md5 and encryption
    //                 // if(foundUser.password===password){
    //                 //     res.render("secrets")
    //                 // }else{console.log("hey brother")}
    //             }
    //         }
    //     }
    //     )





app.listen(3000, function() {
    console.log("Server started on port 30000");
  });