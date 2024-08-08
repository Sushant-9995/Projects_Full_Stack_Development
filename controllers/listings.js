const listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    // listing.find({}).then((res)=>{
//         console.log(res)
// });
    const allListings=await listing.find({});
    res.render("listings/index.ejs",{allListings});
 };

 module.exports.renderNewForm=(req,res)=>{
    //console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing= async (req, res) => {
    let { id } = req.params;
    const listing1 = await listing.findById(id).populate({path:"reviews", populate:{
        path:"author",
    },
}).populate("owner");
    if(!listing1){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings")
    }
    console.log(listing1);
    res.render("listings/show.ejs", { listing1 });
  };

  module.exports.createListing=async(req,res,next)=>{
       
    // if(!req.body.listing){
    //     throw new ExpressError(404,"send valid Data for listings");
    // }
    let newListing= new listing (req.body.listing);
    newListing.owner=req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");

};

module.exports.renderEditForm=async(req,res)=>{
    // if(!req.body.listing){
    //     throw new ExpressError(404,"send valid Data for listings");
    // }
    let { id } = req.params;
    const listing1 = await listing.findById(id);
    if(!listing1){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs",{listing1});
};

module.exports.updateListing=async (req ,res)=>{
    let { id } = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
   //res.redirect("/listings");
   req.flash("success"," Listing Updated!");
   res.redirect(`/listings/${id}`);
};

module.exports.destroy=async (req ,res)=>{
    let { id } = req.params;
   let deletedListing= await listing.findByIdAndDelete(id);
   console.log(deletedListing);
   req.flash("success"," Listing Deleted!");
   res.redirect("/listings");
   
};