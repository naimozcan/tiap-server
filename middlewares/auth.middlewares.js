const jwt = require("jsonwebtoken")

// *** Verify Logged In User
function verifyToken(req, res, next) {

    console.log(req.headers)

    try {
        const authToken = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(authToken, process.env.TOKEN_SECRET)
        console.log("PAYLOAD: ", payload)
        req.payload = payload
        next()
    } catch (error) {
        res.status(401).json({ errorMessage: "TOKEN IS NOT VALID!!!" })
    }
}

// *** Verify Admin
function verifyAdmin(req, res, next) {
    
    console.log(req.payload.role)
    
    if(req.payload.role !== "admin" && req.payload.role !== "superAdmin" ){
        res.status(401).json({errorMessage: "!!! You are not authorized. If you think there is an error, please talk with the executive personnel."})
        return
    } else {
        next()
    }
}

// *** Verify Super Admin
function verifySuperAdmin(req, res, next) {

    console.log(req.payload.role)

    if(req.payload.role !== "superAdmin" ){
        res.status(401).json({errorMessage: "!!! You are not authorized. If you think there is an error, please talk with the executive personnel."})
        return
    } else {
        next()
    }
}

module.exports = { verifyToken, verifyAdmin, verifySuperAdmin }