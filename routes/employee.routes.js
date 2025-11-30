const router = require("express").Router()
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")
const Employee = require("../models/Employee.model")

// *** Get All Employees (Also by Search Params) ***
router.get("/", verifyToken, async (req, res, next) => {
    try {
        const Employees = await Employee.find(req.query)
        res.status(200).json(Employees)
    } catch (error) {
        next(error)
    }
})

// *** Update an Employee ***
router.put("/:_id", verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params._id, {...req.body}, { new: true })
        res.status(200).json(updatedEmployee)
    } catch (error) {
        next(error)
    }
})

// *** Get Single Employee ***
router.get("/:_id", verifyToken, async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params._id)

        res.status(200).json(employee)
    } catch (error) {
        next(error)
    }
})

// *** Delete Employee ***
router.delete("/:_id", verifyToken, verifyAdmin, async (req, res, next) => {
    try {
        await Employee.findByIdAndDelete(req.params._id)
        res.status(200).json({message: "Employee deleted successfuly"})
    } catch (error) {
        next(error)
    }
}) 

module.exports = router