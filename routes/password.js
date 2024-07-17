const express = require("express")

const { resetPassword } = require("../controllers/password")


const router = express.Router()

router.route("/").post(resetPassword)

module.exports = router
