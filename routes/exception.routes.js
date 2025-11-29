const router = require("express").Router()
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")
const { generateLogNumber } = require("../middlewares/util.middlewares")
const Exception = require("../models/Exception.model")

// *** Get All Exceptions (Also by Search Params) ***
router.get("/", verifyToken, async (req, res, next) => {
    try {
        const exceptions = await Exception.find(req.query)
        res.status(200).json(exceptions)
    } catch (error) {
        next(error)
    }
})

// *** Create a New Exception ***
router.post("/", verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const exceptionLogNo = await generateLogNumber("exception")

        const newException = {...req.body, no: exceptionLogNo}

        await Exception.create(newException)
        res.status(201).json({message: "New exception log created successfully."})
    } catch (error) {
        next(error)
    }
})

// *** Get Single Exception ***
router.get("/:_id", verifyToken, async (req, res, next) => {
    try {
        const exception = await Exception.findById(req.params._id)
        res.status(200).json(exception)
    } catch (error) {
        next(error)
    }
})


// *** Delete Exception ***
router.delete("/:_id", verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const exception = await Exception.delete(req.params._id)
        res.status(200).json(exception)
    } catch (error) {
        next(error)
    }
})

module.exports = router