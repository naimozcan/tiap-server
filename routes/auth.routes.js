const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const verifyToken = require("../middlewares/auth.middlewares.js")
const { PASSWORD_REGEX } = require("../constants/enums.js")
const Employee = require("../models/Employee.model")

// *** Test ***
router.get("/", (req, res, next) => {
    console.log("all is good.")
    res.send("all is good.")
    next()
})

// *** Sign Up ***
router.post("/signup", async (req, res, next) => {

    console.log(req.body)

    const { name, department, title, email, password } = req.body
    
    // New Employee Data Integrity/Correction Check: 
    if(!name ||!department||!title || !email ||!password ){
        res.status(400).json({errorMessage: "Please fill all mandatory fields."})
        return
    }
    if(!PASSWORD_REGEX.test(password)){
        res.status(400).json({errorMessage: "Password is not strong enough, choose a stronger one."})
        return
    }

    try{
        const foundUser = await Employee.findOne({email: email})
        console.log("found user: ", foundUser)
        
        if(foundUser){
            console.log("Client tried to create a new user/employee with the existing email address!")
            res.status(400).json({errorMessage: "Email already exist! Use an another address."})
            return
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newEmployee = {
            ...req.body,
            password: hashPassword
        }

        await Employee.create(newEmployee)

        console.log("New user signed up!: ", newEmployee.name)
        res.status(201).json({errorMessage: "New user signed up!: "})
        
    }catch(error){
        next(error)
    }
    
})

module.exports = router
