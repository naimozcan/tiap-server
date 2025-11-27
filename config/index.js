const express = require("express")
const logger = require("morgan")
const cors = require("cors")

function config(server){
    server.use(logger("dev")) //
    server.use(cors({origin: process.env.origin}))
    server.use(express.urlencoded({extended: false}))
    server.use(express.json())
}

module.exports = config