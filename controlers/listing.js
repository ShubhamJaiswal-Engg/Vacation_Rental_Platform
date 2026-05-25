const mongoose = require("mongoose");
const Listing = require("../model/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { link } = require("joi");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports.index = async(req,res) => {
    const rawQuery = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const searchQuery = rawQuery.length > 60 ? rawQuery.slice(0, 60) : rawQuery;

    let allListing;
    if (searchQuery) {
        const regex = new RegExp(escapeRegex(searchQuery), "i");
        allListing = await Listing.find({ title: regex });
    } else {
        allListing = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListing, searchQuery });
 };

module.exports.suggest = async (req, res) => {
    const rawQuery = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const searchQuery = rawQuery.length > 60 ? rawQuery.slice(0, 60) : rawQuery;

    if (!searchQuery) {
        return res.json({ suggestions: [] });
    }

    const regex = new RegExp(escapeRegex(searchQuery), "i");
    const suggestions = await Listing.find({ title: regex })
        .sort({ title: 1 })
        .limit(8)
        .select({ title: 1 });

    res.json({
        suggestions: suggestions.map((doc) => ({ _id: doc._id, title: doc.title })),
    });
};

 module.exports.renderNewForm =  (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    if (!mongoose.isValidObjectId(id)) {
        return res.redirect("/listings");
    }
    const listing = await Listing.findById(id)
    .populate({path:"reviews", populate:{path:"author"},})
    .populate("owner");
    if(!listing){
       req.flash("error", "Listing you requested for does not exit");
       return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing,mapToken: process.env.MAP_TOKEN});
};

module.exports.createListing = async(req,res,next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1, 
      })
        .send();
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(filename);
    // console.log(url,"..",filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res) => {
    let {id} = req.params;
    if (!mongoose.isValidObjectId(id)) {
        req.flash("error", "Invalid listing id");
        return res.redirect("/listings");
    }
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exit");
        return res.redirect("/listings");
     }

     let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/h_200,w_250");
        // console.log("Original Image URL:", originalImageUrl);

    res.render("listings/edit.ejs",{listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
        req.flash("error", "Invalid listing id");
        return res.redirect("/listings");
    }
    const updatedData = req.body?.listing;
    if (!updatedData || typeof updatedData !== "object") {
        req.flash("error", "Invalid listing data");
        return res.redirect(`/listings/${id}/edit`);
    }

    const listing = await Listing.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
    });

    if (!listing) {
        req.flash("error", "Listing you requested for does not exit");
        return res.redirect("/listings");
    }

    // Update geometry only if we have a non-empty location
    const location = typeof updatedData.location === "string" ? updatedData.location.trim() : "";
    if (location) {
        try {
            const response = await geocodingClient
                .forwardGeocode({ query: location, limit: 1 })
                .send();

            const geometry = response?.body?.features?.[0]?.geometry;
            if (geometry) {
                listing.geometry = geometry;
            }
        } catch (e) {
            // If geocoding fails, keep existing geometry and continue.
        }
    }

    if (req.file) {
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", " Listing Updated");
    res.redirect(`/listings/${id}`);
};
 module.exports.destroyListing = async(req,res) => {
     let {id} = req.params;
     if (!mongoose.isValidObjectId(id)) {
         req.flash("error", "Invalid listing id");
         return res.redirect("/listings");
     }
     const deleted = await Listing.findByIdAndDelete(id);
     if (!deleted) {
        req.flash("error", "Listing already deleted (or not found)");
        return res.redirect("/listings");
     }
    //  let deleteListing = await Listing.findByIdAndDelete(id);
    //  console.log(deleteListing);
     req.flash("success", "Listing Delete");
     res.redirect("/listings");
 };