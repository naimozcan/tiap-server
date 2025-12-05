const router = require("express").Router()
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")
const RootCause = require("../models/RootCause.model")

// *** Get All RootCauses (Also by Search Params) ***
router.get("/", verifyToken, async (req, res, next) => {
    try {
        const rootCauses = await RootCause.find(req.query)
        res.status(200).json(rootCauses)
        console.log("***ROOT CAUSE GET REQUEST***", req.query)
        console.log("***ROOT CAUSE GET RESPONSE***", rootCauses)
    } catch (error) {
        next(error)
    }
})

// *** Create a New RootCause ***
router.post("/", verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const newRootCause = {...req.body}
        await RootCause.create(newRootCause)
        res.status(201).json({message: "New root cause created successfully."})
    } catch (error) {
        next(error)
    }
})

// *** Update an RootCause ***
router.put("/:_id", verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const updatedRootCause = await RootCause.findByIdAndUpdate(req.params._id, {...req.body}, { new: true })
        res.status(200).json({message: "Root cause updated successfully."})
    } catch (error) {
        next(error)
    }
})

// *** Get Single RootCause ***
router.get("/:_id", verifyToken, async (req, res, next) => {
    try {
        const rootCause = await RootCause.findById(req.params._id)

        res.status(200).json(rootCause)
    } catch (error) {
        next(error)
    }
})

// *** Delete RootCause ***
router.delete("/:_id", verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        await RootCause.findByIdAndDelete(req.params._id)
        res.status(200).json({message: "RootCause deleted successfuly"})
    } catch (error) {
        next(error)
    }
})

module.exports = router