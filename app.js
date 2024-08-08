const express=require("express");
const app=express();

const mongoose=require("mongoose");
// const listing = require("./models/listing.js");
const mongoo_Url="mongodb://127.0.0.1:27017/wanderlust";

const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema , reviewSchema}=require("./schema.js");
// const Review=require("./models/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const methodOveride=require("method-override");
const {isLoggedIn}=require("../MajorProject/middleware.js");
const {saveRedirectUrl}=require("../MajorProject/middleware.js");
const {isOwner}=require("../MajorProject/middleware.js");
async function main(){
    await mongoose.connect(mongoo_Url);
}
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
main()
.then( ()=> {
console.log("Connected to DB");
})
.catch((err)=>{
    console.log(err);
});
const path=require("path");
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));

app.use(methodOveride("_method"));
app.engine('ejs',ejsMate);

app.use(express.static(path.join(__dirname,"/public")));
app.get("/",(req,res)=>{
res.send("Hi,I am root");
});

const sessionOption={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now+1000*24*7*60*60,
        maxAge:1000*24*7*60*60,
        httpOnly:true,
    },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;

   // console.log(res.locals.success);
    next();
});

// app.get("/demouser", async (req,res)=>{
//     let fakeUser=new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });
//     let registeredUser= await  User.register(fakeUser,"helloworld");
//     res.send(registeredUser); 
// });

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);


//REviews post Routeuser

// app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req,res)=>{
//     let listing1=await listing.findById(req.params.id);
//     let newReview=await Review(req.body.review);

//     listing1.reviews.push(newReview);

//     await newReview.save();
//     await listing1.save();

//     // console.log("New Review saved");
//     // res.send("New Review saved");
//     res.redirect(`/listings/${listing1._id}`);

// }));

// //Review Delete Route

// app.delete("/listings/:id/reviews/:reviewId" ,wrapAsync(async(req,res)=>{
//     let{id,reviewId}=req.params;
//     await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
// }));
// app.get("/testlisting",async(req,res)=>{
// let samplelisting=new listing({
//     title:"my new villa",
//     description:"by the beach",
//     price:1200,
//     location:"calcangute ,Goa",
//     country:"India",
// });
// await samplelisting.save();
//     console.log("sample wsa saved");
//     res.send("successful testing");

// });
app.all("*",( req,res,next)=>{
    next(new ExpressError(404 ,"page Not Found!"));

});
app.use((err,req,res,next)=>{
   let{statuscode=500 ,message="something went wrong"}=err;
   res.status(statuscode).render("Error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("Server is listening to port 8080");
});