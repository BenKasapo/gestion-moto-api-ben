const express = require("express")

const { resetPassword } = require("../controllers/password")


const router = express.Router()

router.post("/password", resetPassword)

module.exports = router
