const router = require("express").Router()
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")
const SKU = require("../models/SKU.model")

// *** Get All SKUs (Also by Search Params) ***
router.get("/", verifyToken, async (req, res, next) => {
    try {
        const skus = await SKU.find(req.query)
        res.status(200).json(skus)
    } catch (error) {
        next(error)
    }
})

// *** Get Single SKU ***
router.get("/:_id", verifyToken, async (req, res, next) => {
    try {
        const sku = await SKU.findById(req.params._id)

        res.status(200).json(sku)
    } catch (error) {
        next(error)
    }
})

module.exports = router