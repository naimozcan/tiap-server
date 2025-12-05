function handleErrors(app) {

    // *** No Matching URL ***
    app.use((req, res) => {
        res.status(404).json({ errorMessage: "There is no point you can access by this URL." })
    })

    // *** Any Other 
    app.use((error, req, res) => {
        console.log(`Error occured while processing the request.
        METHOD: ${req.method}
        PATH: ${req.path}
        ERROR MESSAGE: ${error.message}
        STATUS: ${error.status || 500}`)

        const statusCode = error.status || error.statusCode || 500;

        let errorMessage

        if (statusCode === 400) {
            errorMessage = error.message || "Bad Request - Invalid data provided."
        } else if (statusCode === 401) {
            errorMessage = error.message || "Unauthorized - Authentication required."
        } else if (statusCode === 403) {
            errorMessage = "Forbidden - You don't have permission."
        } else if (statusCode === 404) {
            errorMessage = "Not Found"
        } else {
            errorMessage = error.message || "Internal server error. Check the server console for details."
        }

        res.status(statusCode).json({
            errorMessage: errorMessage,
            status: statusCode
        })
    })
}

module.exports = handleErrors