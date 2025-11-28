const { Schema, model } = require("mongoose")
const { ZONES, LOCATION_PURPOSES, LOCATION_REGEX } = require("../constants/enums")

const locationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            match: LOCATION_REGEX
        },
        zone: {
            type: String,
            required: true,
            enum: ZONES
        },
        purpose: {
            type: String,
            required: true,
            enum: LOCATION_PURPOSES
        },
        storedItems: [
            {
                sku: {
                    type: Schema.Types.ObjectId,
                    ref: "SKU"
                },
                totalQty: {
                    type: Number,
                    default: 0
                },
                availableQty: {
                    type: Number,
                    default: 0
                },
                occupiedQty: {
                    type: Number,
                    default: 0
                }
            }
        ]
    }
)