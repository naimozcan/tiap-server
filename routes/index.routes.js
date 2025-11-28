const router = require("express").Router()

router.get("/", (req, res, next) => {
    res.json({ message: "Server received a request." })
})

// *** CRUD Routes (Main Dynamic Data) ***

const authRouter = require("./auth.routes")
router.use("/auth", authRouter)

const exceptionRouter = require("./exception.routes")
router.use("/exceptions", exceptionRouter)

const rootCauseRouter = require("./root-cause.routes")
router.use("/exceptions", rootCauseRouter)

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


module.exports = router