const router = require("express").Router()
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")
const TaskCollection = require("../models/TaskCollection.model")

// *** Get All TaskCollections (Also by Search Params) ***
router.get("/", verifyToken, async (req, res, next) => {
    try {
        const taskCollections = await TaskCollection.find(req.query)
        .populate("order")
        res.status(200).json(taskCollections)
    } catch (error) {
        next(error)
    }
})

// *** Get Single TaskCollection ***
router.get("/:_id", verifyToken, async (req, res, next) => {
    try {
        const taskCollection = await TaskCollection.findById(req.params._id)
        .populate("order")

        res.status(200).json(taskCollection)
    } catch (error) {
        next(error)
    }
})

module.exports = router