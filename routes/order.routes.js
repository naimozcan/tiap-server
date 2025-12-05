const router = require("express").Router()
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")
const Order = require("../models/Order.model")

// *** Get All Orders (Also by Search Params) ***
router.get("/", verifyToken, async (req, res, next) => {
    try {
        const orders = await Order.find(req.query)
        console.log(orders)
        res.status(200).json(orders)
    } catch (error) {
        next(error)
    }
})

// *** Get Single Order ***
router.get("/:_id", verifyToken, async (req, res, next) => {
    try {
        const order = await Order.findById(req.params._id)

        res.status(200).json(order)
    } catch (error) {
        next(error)
    }
})

module.exports = router