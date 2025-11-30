const router = require("express").Router()
const cloudinary = require("../config/cloudinary")
const { verifyToken } = require("../middlewares/auth.middlewares")
const { upload } = require("../middlewares/util.middlewares")

// *** Upload an Image to Cloudinary & Send the Link as Response ***
router.post("/", verifyToken, upload.single("image"), async (req, res, next) => {
    try {

        if (!req.file) {
            return res.status(400).json({ errorMessage: "File is not uploaded successfully." })
        }

        const cloudinaryUpload = await cloudinary.uploader.upload(req.file.path, {folder: "tiap-app"})

        const url = cloudinaryUpload.secure_url 
        res.status(200).json({url: url})

    } catch (error) {
        console.log("Image not uploaded!!!")
        next(error)
    }
})

module.exports = router