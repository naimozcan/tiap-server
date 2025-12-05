const router = require("express").Router()
const { verifyAdmin, verifyToken } = require("../middlewares/auth.middlewares")

router.get("/", verifyToken, (req, res, next) => {
    res.status(200).json({ message: "Test OK." })
    console.log("received")
})

// *** Authorization ***
const authRouter = require("./auth.routes")
router.use("/auth", authRouter)

// *** CRUD Routes (Main Dynamic Data) ***
const exceptionRouter = require("./exception.routes")
router.use("/exceptions", exceptionRouter)

const rootCauseRouter = require("./root-cause.routes")
router.use("/root-causes", rootCauseRouter)

const employeeRouter = require("./employee.routes")
router.use("/employees", employeeRouter)

// *** Read-Only (GET) Routes (Mock Data for WMS Flow Simulation) ***
const skuRouter = require("./sku.routes")
router.use("/skus", skuRouter)

const locationRouter = require("./location.routes")
router.use("/locations", locationRouter)

const taskRouter = require("./task.routes")
router.use("/tasks", taskRouter)

const taskCollectionRouter = require("./task-collection.routes")
router.use("/task-collections", taskCollectionRouter)

const ordersRouter = require("./order.routes")
router.use("/orders", ordersRouter)

const uploadsRouter = require("./upload.routes")
router.use("/uploads", uploadsRouter)

module.exports = router