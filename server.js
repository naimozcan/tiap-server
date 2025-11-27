try {
    process.loadEnvFile()
} catch(error){
    console.warn(`${error}, .env not found. Local enviroment values will be used.`)
}

// *** Database Connection ***
const express = require("express")
const server = express()

// *** Config (Requests will pass through these middlewares) ***
require("./config")

// Endpoints/Routes:


