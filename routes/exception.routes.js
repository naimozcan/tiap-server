const router = require("express").Router()
const mongoose = require("mongoose")
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")
const { generateLogNumber } = require("../middlewares/util.middlewares")
const Exception = require("../models/Exception.model")


// *** Get All Exceptions (Also by Search Params) ***
router.get("/", verifyToken, async (req, res, next) => {
    try {

        const query = {...req.query}

        if (req.query.createdAt) {
            query.createdAt = {
                $gte: new Date(req.query.createdAt).setHours(0, 0, 0, 0),
                $lt: new Date(req.query.createdAt).setHours(23, 59, 59, 999)
            }
        }

         if (req.query.rootcause) {
            query.rootcause = new mongoose.Types.ObjectId(req.query.rootcause)
        }

        const exceptions = await Exception.find(query)
            .populate('order')
            .populate('sku')
            .populate('taskCollection')
            .populate({
                path: "task",
                populate: {
                    path: "location",
                    ref: "Location"
                }
            })
            .populate('location')
            .populate('rootcause')
        res.status(200).json(exceptions)
        console.log("***EXCEPTIONS GET REQUEST***", query)
        console.log("***EXCEPTIONS GET RESPONSE***", exceptions)
    } catch (error) {
        next(error)
    }
})

// *** Create a New Exception ***
router.post("/", verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const exceptionLogNo = await generateLogNumber("exception")
        const newException = { ...req.body, no: exceptionLogNo }
        await Exception.create(newException)
        res.status(201).json({ message: "New exception log created successfully." })
    } catch (error) {
        next(error)
    }
})

// *** Update an Exception ***
router.put("/:_id", verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const updatedExceptionLog = await Exception.findByIdAndUpdate(req.params._id, { ...req.body }, { new: true })
        res.status(200).json({updatedExceptionLog, message: "Exception log updated successfully."})
    } catch (error) {
        next(error)
    }
})

// *** Get Single Exception ***
router.get("/:_id", verifyToken, async (req, res, next) => {
    try {
        const exception = await Exception.findById(req.params._id)
            .populate('order')
            .populate('sku')
            .populate('taskCollection')
            .populate('task')
            .populate('location')
            .populate('rootcause')
        res.status(200).json(exception)
    } catch (error) {
        next(error)
    }
})

// *** Delete Exception ***
router.delete("/:_id", verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        await Exception.findByIdAndDelete(req.params._id)
        res.status(200).json({ message: "Exception deleted successfuly" })
    } catch (error) {
        next(error)
    }
})

module.exports = router