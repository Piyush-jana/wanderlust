const mongoose = require("mongoose");
const initData = require("./data");
const review = require("../models/review.js")

const schema = mongoose.Schema;

const listingSchema = new schema({
    title:{
        type:String,
        required:true,
    },
    description:{   type:String,
        required:true,},
    image:{ 
        filename:{
            type:String,
        },
        url:{
            type: String,
        }},
    price:{   
        type:Number},
    location:{   
        type:String,
        required:true,},
    country:{   
        type:String,
        required:true,
    },
    review:[{
        type:schema.Types.ObjectId,
        ref : "Review",
    }],
    owner:{
        type: schema.Types.ObjectId,
        ref: "User",
    },
    geometry :{
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      category:{
        type : String,
        enum : ["Trending","Rooms","Iconic Cities","Mountain","Castle","Artic","Camping","Farms"]
      }

});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id : {$in : listing.review}});  
    }
})

const Listing = mongoose.model('Listing',listingSchema);

module.exports = Listing ;

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj , owner:"6777c6efa2d127e2097ebec2"}));
    await Listing.insertMany(initData.data);
    console.log("data is initalized")
}

initDB();
