const express =  require('express');
const { 
    addPayment,
    getPayments,
    getPayment,
    updatePayment,
    deletePayment,
    getPaymentsForDriver
 } = require('../controllers/payments');
const router = express.Router()

router.route("/")
.get(getPayments)
.post(addPayment)

router.route("/:id")
.get(getPayment)
.put(updatePayment)
.delete(deletePayment)


router.route("/get_payments_for_driver/:id_driver")
.get(getPaymentsForDriver)


module.exports = router;