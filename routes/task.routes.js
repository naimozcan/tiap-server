const router = require("express").Router()
const mongoose = require("mongoose")
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")
const Task = require("../models/Task.model")

// *** Get All Tasks (Also by Search Params) ***
router.get("/", verifyToken, async (req, res, next) => {

    const query = {...req.query}

    if (req.query.taskCollection) {
        query.taskCollection = new mongoose.Types.ObjectId(req.query.taskCollection)
    }

    if (req.query.sku) {
        query.sku = new mongoose.Types.ObjectId(req.query.sku)
    }

    try {
        const tasks = await Task.find(query)
            .populate({
                path: "location",
                populate: {
                    path: "storedItems.sku",
                    model: "SKU"
                }
            })
            .populate({
                path: "taskCollection",
                populate: [
                    {
                        path: "order",
                        model: "Order"
                    },
                    {
                        path: "employee",
                        model: "Employee"
                    }]
            })
            .populate("sku")
        console.log("!!! *** REQUEST *** !!!:", query)
        console.log("!!! *** TASKS *** !!!:", tasks)
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
                populate: [
                    {
                        path: "order",
                        model: "Order"
                    },
                    {
                        path: "employee",
                        model: "Employee"
                    }]
            })
            .populate("sku")

        res.status(200).json(task)
    } catch (error) {
        next(error)
    }
})

module.exports = router