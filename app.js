
require("dotenv").config();

const express = require("express");
const app = express();
const path =require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")

const reviewRouter = require("./routes/review.js");
const listingRouter = require("./routes/listing .js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLAS;

async function main(){
    await mongoose.connect(dbUrl);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24 * 3600 ,
})

store.on("error" , () =>{
    console.log("Error in our session store",err)
})

const sessionOption = {
    store : store ,
    secret :process.env.SECRET,
    resave : false , saveUninitialized : true ,
    cookie :{
        expires : Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true ,
    }
}




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/listing",listingRouter);

app.use("/listing/:id/review",reviewRouter);

app.use("/",userRouter);

app.use((err,req,res,next)=>{
    let { statusCode =500 , message="something went wrong"} = err;
    res.status(statusCode).render("listing/error.ejs",{message});
})

app.all("*",(err,req,res,next)=>{
    let { statusCode =500 , message="something went wrong"} = err;
    res.status(statusCode).render("listing/error.ejs",{message}); 
})

app.listen(8080, (req,res)=>{
    console.log("server started");
})

main().then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log(err);
})




