const express = require("express")
const { stats,getstatsAssociation} = require("../controllers/statistics")
const router = express.Router()

router.route("/").get(stats)
router.get('/:association',getstatsAssociation);


module.exports = router
