const express =  require('express');
const { 
    getPeriods,
    addPeriod,
    getPeriod,
    updatePeriod,
    deletePeriod,
    getUnpaidPeriods
 } = require('../controllers/periods');
const router = express.Router()


router.route("/")
.get(getPeriods)
.post(addPeriod)

router.route("/:id")
.get(getPeriod)
.put(updatePeriod)
.delete(deletePeriod)

router.route("/get_unpaid_periods/:id_user/:id_cotisation")
.get(getUnpaidPeriods)

module.exports = router;