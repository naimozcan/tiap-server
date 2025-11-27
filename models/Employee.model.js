const { Schema, model } = require("mongoose")

const employeeSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    }
)