const { Schema, model } = require("mongoose")
const { ZONES, SKU_REGEX } = require("../constants/enums")


const skuSchema = new Schema(
    {
        no: {
            type: String,
            required: true,
            unique: true,
            match: SKU_REGEX
        },
        zone: {
            type: String,
            required: true,
            enum: ZONES
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true
        }
        
    }
)

const SKU = model("SKU", skuSchema)

module.exports = SKU