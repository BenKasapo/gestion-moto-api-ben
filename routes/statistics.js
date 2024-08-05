const express = require("express")
const { stats } = require("../controllers/statistics")
const router = express.Router()

router.route("/").get(stats)

module.exports = router
