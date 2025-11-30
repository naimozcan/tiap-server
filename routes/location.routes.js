const router = require("express").Router()
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")
const Location = require("../models/Location.model")

// *** Get All Locations (Also by Search Params) ***
router.get("/", verifyToken, async (req, res, next) => {
    try {
        const locations = await Location.find(req.query)
            .populate({
                path: "storedItems.sku",
                model: "SKU"
            })
        res.status(200).json(locations)
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