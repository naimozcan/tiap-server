const { TASK_TYPES, EXCEPTION_TYPES } = require("../constants/enums")
const { Schema, model } = require("mongoose")

const rootCauseSchema = new Schema(
    {
        task: {
            type: String,
            required: true,
            enum: TASK_TYPES
        },
        type: {
            type: String,
            required: true,
            enum: EXCEPTION_TYPES
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "Employee"
        }
    },
    {
        timestamps: true
    }
)

const RootCause = model("RootCause", rootCauseSchema)

module.exports = RootCause