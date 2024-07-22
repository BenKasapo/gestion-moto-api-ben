const express =  require('express');
const { 
    getPeriods,
    addPeriod,
    getPeriod,
    updatePeriod,
    deletePeriod,
    getUnpaidPeriods,
    getPeriodsForCotisation
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

router.route("/get_periods_for_cotisation/:id_cotisation")
.get(getPeriodsForCotisation)

module.exports = router;