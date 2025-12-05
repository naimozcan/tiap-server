const router = require("express").Router()
const mongoose = require("mongoose")
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")
const Location = require("../models/Location.model")

// *** Get All Locations (Also by Search Params) ***
router.get("/", verifyToken, async (req, res, next) => {

    let query = {}

    if (req.query.skuId) {
       query["storedItems.sku"] = new mongoose.Types.ObjectId(req.query.skuId) 
    } else {
        query = {...req.query}
    }

    try {
        const locations = await Location.find(query)
            .populate({
                path: "storedItems.sku",
                model: "SKU"
            })
        res.status(200).json(locations)
        console.log("***LOCATION GET REQUEST***", query)
        console.log("***LOCATION GET RESPONSE***", locations)
    } catch (error) {
        next(error)
    }
})

// *** Get Single Location ***
router.get("/:_id", verifyToken, async (req, res, next) => {
    try {
        const location = await Location.findById(req.params._id)
            .populate({
                path: "storedItems.sku",
                model: "SKU"
            })

        res.status(200).json(location)
    } catch (error) {
        next(error)
    }
})

module.exports = router