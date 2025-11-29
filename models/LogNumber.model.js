const { LOG_TYPE_ENUM } = require("../constants/enums")

const { Schema, model } = require("mongoose")

const logNumberSchema = new Schema(
    {
        type: {
            type: String,
            enum: LOG_TYPE_ENUM
        },
        counter: {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

const LogNumber = model("LogNumber", logNumberSchema)

module.exports = LogNumber