// *** Log Number Generator ***

const LogNumber = require("../models/LogNumber.model")

async function generateLogNumber(logType) {
    
    try {
        const today = new Date().toISOString().slice(0, 10)
        
        let counterObj = await LogNumber.findOne({ type: logType })
        
        const lastUpdateDay = counterObj.updatedAt.toISOString().slice(0, 10)
        
        console.log("last update date: ", lastUpdateDay)
        console.log("TODAY: ", today)
        
        if (lastUpdateDay !== today) {
            counterObj = await LogNumber.findOneAndUpdate(
                { type: logType },
                { $set: { counter: 1, date: today } },
                { returnDocument: "after" }
            )
        } else {
            counterObj = await LogNumber.findOneAndUpdate(
                { type: logType },
                { $inc: { counter: 1 } },
                { returnDocument: "after" }
            )
        }
        
        if (logType === "exception") {
            const counter = counterObj.counter
            const formattedDate = today.replace(/-/g, "")
            const formattedCounter = counter.toString().padStart(6, "0")
            const generatedNo = `EXO${formattedDate}${formattedCounter}E`
            console.log("generated no: ", generatedNo)
            return generatedNo
        } else {
            return "not valid log type.."
        }
        
    } catch (error) {
        console.log(error)
    }
}

// *** Multer ***
const multer = require("multer")
const upload = multer({ dest: "uploads/" })

module.exports = { generateLogNumber, upload }