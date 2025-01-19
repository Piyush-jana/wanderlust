const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//index route
router.get("/" ,wrapAsync(listingController.index));
//filters route
router.get("/filter",wrapAsync(listingController.filter));
//search route
router.post("/search",wrapAsync(listingController.search));
//terms and privacy
router.get("/privacy",wrapAsync(listingController.privacy));
router.get("/terms",wrapAsync(listingController.terms));

//new listing form 
//create route
router.route("/new")
.get(isLoggedIn,listingController.newForm)
.post(isLoggedIn, upload.single("listing[image]"),wrapAsync(listingController.create));

//edit form
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editForm));

//update route
//delete route
//show in detail listing
router.route("/:id")
.get(wrapAsync (listingController.show))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),(req, res, next) => { if (req.file) { console.log('File uploaded successfully'); } next() },wrapAsync (listingController.update))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.delete));


module.exports = router;