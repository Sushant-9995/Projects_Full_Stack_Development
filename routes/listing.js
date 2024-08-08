const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const listing = require("../models/listing.js");
const { isLoggedIn , isOwner ,validatelisting } = require("../middleware.js");

const listingController=require("../controllers/listings.js");

router.
   route("/")
  .get(wrapAsync(listingController.index))   //Index Route
  .post( isLoggedIn, validatelisting,   wrapAsync(listingController.createListing));     //Create Route

  //New Route   
router.get("/new", isLoggedIn,(listingController.renderNewForm));
router.
   route("/:id")
   .get(wrapAsync(listingController.showListing))    //show Route
   .put(  isLoggedIn, isOwner, wrapAsync(listingController.updateListing))   //update Route
   .delete( isLoggedIn, isOwner, wrapAsync(listingController.destroy));     //Delete Route

//Edit Route
router.get("/:id/edit",  isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));
module.exports=router;