const express = require("express")
const {
  stats,
  getstatsAssociation,
  getstatsProgram,
} = require("../controllers/statistics")
const router = express.Router()

router.route("/").get(stats)
router.get("/:association", getstatsAssociation)
router.get("/program/:program", getstatsProgram)

module.exports = router
