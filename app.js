require('dotenv').config();

var express = require("express");
var app = express(); 
var bodyParser = require("body-parser");
var Restaurant = require("./models/restaurant");
var Comment = require("./models/comment"); 
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user"); 
var methodOverride = require("method-override"); 
var flash = require("connect-flash"); 

//requring routes
var commentRoutes = require("./routes/comment"),
    restaurantRoutes = require("./routes/restaurant"),
    indexRoutes = require("./routes/index"); 
    //mongodb://localhost:27017/restaurant_review
    //mongodb+srv://Sunny:Yss!!8080@resview.aja5m.mongodb.net/restaurant_review?retryWrites=true&w=majority
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/restaurant_review', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended:true})); 
app.set("view engine","ejs"); 
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash()); 

//PASSPORT CONFIGURATION 
app.use(require("express-session")({
    secret: "Secret Page",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize()); 
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.use(function(req, res, next){
    res.locals.currentUser = req.user; 
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); 
})

//Using Routes
app.use("/",indexRoutes); 
app.use("/restaurants",restaurantRoutes); 
app.use("/restaurants/:id/comments",commentRoutes); 


app.listen(3000,function(){
    console.log("ResView Connected"); 
});