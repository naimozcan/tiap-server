const { Schema, model } = require("mongoose")
const { EMPLOYEE_TITLES, EMPLOYEE_ROLES, DEPARTMENTS, EMAIL_REGEX} = require("../constants/enums")


const employeeSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true,
            enum: DEPARTMENTS
        },
        title: {
            type: String,
            required: true,
            enum: EMPLOYEE_TITLES
        },
        role: {
            type: String,
            default: "user",
            enum: EMPLOYEE_ROLES,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            match: EMAIL_REGEX
        },
        password: {
            type: String,
            required: true
        }
        
    },
    {
        timestamps: true
    }
)

const Employee = model("Employee", employeeSchema)

module.exports = Employee