const Listing = require("../init/index");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});


module.exports.index = async (req,res,next)=>{
        const allListing = await Listing.find({});
        res.render("listing/index.ejs",{allListing});
    }


module.exports.newForm = (req,res)=>{
    res.render("listing/new.ejs");
};

module.exports.create = async (req,res)=>{
    let{title,description,price,location,country,category}= req.body;
    let response = await geocodingClient.forwardGeocode({
        query: location ,
        limit: 2
      }).send();
    let URL = req.file.path;
    let filename = req.file.filename;
    
    let newData = new Listing({
        title:title,
        description:description,
        image:{
            filename:filename,
            url:URL,
        },
        price:price,
        location:location,
        country:country,
        geometry:response.body.features[0].geometry,
        category:category,
    })
    newData.owner = req.user._id;
    await newData.save().then(()=>{
        console.log("saved")
    }).catch((err)=>{
        console.log(err);
    })
    req.flash("success","New Listing is created");
    res.redirect("/listing");
};

module.exports.editForm = async (req,res,next)=>{
    let{id} = req.params;
    let listing = await Listing.findById(id);
    if(!Listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listing");
    }
    let originalImage =  listing.image.url;
    originalImage.replace("/upload","/upload/w_300");
    res.render("listing/edit.ejs",{listing,originalImage})
    
};

module.exports.update = async (req,res,next)=>{
    

    let {id} = req.params;
    let{title,description,price,location,country,category}= req.body;

    let response = await geocodingClient.forwardGeocode({
        query: location ,
        limit: 2
      }).send();

    
    if(typeof req.file !== "undefined"){
        let URL = req.file.path;
        let filename = req.file.filename;
        await Listing.findByIdAndUpdate(id,{
            title:title,
            description:description,
            "image.filename":filename,
            "image.url":URL,
            price:price,
            location:location,
            country:country,
            geometry:response.body.features[0].geometry,
            category:category,

        });
    }else{
        await Listing.findByIdAndUpdate(id,{
            title:title,
            description:description,
            price:price,
            location:location,
            country:country,
            geometry:response.body.features[0].geometry,
            category:category,
        });

    };

    req.flash("success","Listing is updated successfully");
    res.redirect(`/listing/${id}`);


   }
    
;

module.exports.delete =  async (req,res,next)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    if(!Listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listing");
        }
    req.flash("success","listing Deleted");
    res.redirect("/listing");
};

module.exports.show = async (req,res,next)=>{
    let {id} = req.params;
    const data = await Listing.findById(id).populate({path : "review", populate :{path :"author"}}).populate("owner");
    if(!Listing){
    req.flash("error","Listing you requested does not exist");
    res.redirect("/listing");
    }

    res.render("listing/show.ejs",{data});
}


module.exports.filter = async (req,res,next)=>{
        let Category = req.query.category;
        const allListing = await Listing.find({category:Category});
        res.render("listing/index.ejs",{allListing});

}

module.exports.search = async (req,res,next)=>{
    let {search} = req.body;
    console.log(search);
    let allListing = await Listing.find({title:search});
    const AllListing = await Listing.find({location:search});
    const ALLLISTING = await Listing.find({country:search});
  if(allListing.length !== 0){
    res.render("listing/index.ejs",{allListing});
  }else if(AllListing.length !== 0){
    allListing = AllListing;
    res.render("listing/index.ejs",{allListing});
  }else{
    allListing = ALLLISTING;
    res.render("listing/index.ejs",{allListing});
  }
   
}

module.exports.privacy = async(req,res,next)=>{
    res.render("listing/privacy.ejs");
}

module.exports.terms = async(req,res,next)=>{
    res.render("listing/terms.ejs");
}