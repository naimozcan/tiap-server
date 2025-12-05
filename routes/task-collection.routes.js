const router = require("express").Router()
const mongoose = require("mongoose")
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")
const TaskCollection = require("../models/TaskCollection.model")

// *** Get All TaskCollections (Also by Search Params) ***
router.get("/", verifyToken, async (req, res, next) => {

    const query = { ...req.query }

    if (req.query.order) {
        query.order = new mongoose.Types.ObjectId(req.query.order)
    }

    try {
        const taskCollections = await TaskCollection.find(query)
            .populate("order")
            .populate("employee")
        res.status(200).json(taskCollections)
        console.log(taskCollections)
        console.log(req.query)
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