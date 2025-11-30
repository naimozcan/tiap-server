const router = require("express").Router()
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")
const Task = require("../models/Task.model")

// *** Get All Tasks (Also by Search Params) ***
router.get("/", verifyToken, async (req, res, next) => {
    try {
        const tasks = await Task.find(req.query)
            .populate({
                path: "location",
                populate: {
                    path: "storedItems.sku",
                    model: "SKU"
                }
            })
            .populate({
                path: "taskCollection",
                populate: {
                    path: "order",
                    model: "Order"
                }
            })
        res.status(200).json(tasks)
    } catch (error) {
        next(error)
    }
})

// *** Get Single Task ***
router.get("/:_id", verifyToken, async (req, res, next) => {
    try {
        const task = await Task.findById(req.params._id)
            .populate({
                path: "location",
                populate: {
                    path: "storedItems.sku",
                    model: "SKU"
                }
            })
            .populate({
                path: "taskCollection",
                populate: {
                    path: "order",
                    model: "Order"
                }
            })

        res.status(200).json(task)
    } catch (error) {
        next(error)
    }
})

module.exports = router