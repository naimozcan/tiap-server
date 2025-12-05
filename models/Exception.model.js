const { Schema, model } = require("mongoose")
const { RECEIEVED_AS, TASK_TYPES, ZONES, DEPARTMENTS, EXCEPTION_TYPES, EXCEPTION_STATUS, EXCEPTION_REGEX } = require("../constants/enums")


const exceptionSchema = new Schema(
    {
        no: {
            type: String,
            required: true,
            unique: true,
            match: [EXCEPTION_REGEX]
        },
        receivedAs: {
            type: String,
            required: true,
            enum: RECEIEVED_AS
        },
        order: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },
        sku: {
            type: Schema.Types.ObjectId,
            ref: "SKU",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: EXCEPTION_TYPES,
        },
        taskType: {
            type: String,
            required: true,
            enum: TASK_TYPES
        },
        taskCollection: {
            type: Schema.Types.ObjectId,
            ref: "TaskCollection",
            required: true
        },
        task: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: true
        },
        zone: {
            type: String,
            required: true,
            enum: ZONES
        },
        location: {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: true
        },
        rootcause: {
            type: Schema.Types.ObjectId,
            ref: "RootCause",
            required: true,
        },
        department: {
            type: String,
            enum: DEPARTMENTS
        },
        replacedFrom: {
            type: String,
            ref: "Location"
        },
        exceptionLocation: {
            type: String,
            ref: "Location"
        },
        skuPrice: {
            type: Number,
            required: true
        },
        totalCost: {
            type: Number,
            required: true
        },
        foundBy: {
            type: String
        },
        errorBy: {
            type: String
        },
        handledBy: {
            type: String
        },
        status:{
            type: String,
            required: true,
            enum: EXCEPTION_STATUS
        },
        image: {
            type: String,
            unique: true
        },
        notes: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

const Exception = model("Exception", exceptionSchema)

module.exports = Exception