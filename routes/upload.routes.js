const router = require("express").Router()
const { verifyToken } = require("../middlewares/auth.middlewares")
const { upload, cloudinary } = require("../config/cloudinary")

// *** Upload an Image to Cloudinary & Send the Link as Response ***
router.post("/", verifyToken, upload.single("image"), async (req, res, next) => {
    try {

        if (!req.file) {
            return res.status(400).json({ errorMessage: "File is not uploaded successfully." })
        }

        const cloudinaryUpload = cloudinary.uploader.upload_stream({
            folder: "tiap-app",
            // allowed_formats: ["jpg", "png"]
        }, (error, result) => {

            if (error) return next(error)

            const url = result.secure_url 
            // console.log("*** IMAGE UPLOAD REQUEST ***", req.file)
            console.log("*** IMAGE UPLOAD RESPONSE ***", url)
            res.status(200).json({url:url})
        })

        cloudinaryUpload.end(req.file.buffer) // ???

    } catch (error) {
        console.log("Image not uploaded!!!")
        next(error)
    }
})

module.exports = router