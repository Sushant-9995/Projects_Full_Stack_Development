const listing=require("../models/listing");
const  Review=require("../models/review");

const User=require("../models/user");

module.exports.signUp=async(req,res)=>{
    try{
        let{username , email ,password}=req.body;
        const newUser=new User({ email ,username});
        const registeredUser=await User.register(newUser,password);
         console.log(registeredUser);
         req.logIn(registeredUser ,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome To WanderLust");
          res.redirect("/listings");
     } );
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
   
};

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
    };

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    //res.send("Welcome To WanderLust");
    req.flash("success", "Welcome To WanderLust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

module.exports.logOut=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are Logged out!");
        res.redirect("/listings");
    })
};