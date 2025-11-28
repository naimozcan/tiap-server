const User = require("../models/User.model");
const router = require("express").Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/auth.middlewares.js");