const express = require("express")

const { resetPassword } = require("../controllers/passwordReset")

const router = express.Router()

router.post("/reset-password", resetPassword)

module.exports = router
