const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { ref } = require("joi");
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
       default:"https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
       type:String,
       set:(v)=> 
        v ==="" ?" https://images.pexels.com/photos/457882/pexels-photo-457882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2":v,
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: { $in :listing.reviews}});
    }
});

const listing=mongoose.model("listing",listingSchema);
module.exports=listing;