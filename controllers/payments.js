const { 
    createPayment,
    retrievePayments,
    retrievePayment,
    changePayment,
    removePayment,
    retrievePaymentsForDriver
 } = require("../database/requests")

const addPayment = async (req, res) => {
    if (!await createPayment(req.body)) {
        res.status(500).send("Cannot create a payment")
    } else {
        res.status(201).send("Payment created")
    }
}
const getPayments = async (req, res) => {
    let payments;
    if (req.query) {
        payments = await retrievePayments(req.query);
    } else {
        payments = await retrievePayments();
    }
    res.status(200).json(payments)
}
const getPayment = async (req, res) => {
    const payment = await retrievePayment(req.params.id);
    res.status(200).json(payment)
}
const updatePayment = async (req, res) => {
    if (!await changePayment(req.params.id, req.body)) {
        res.status(500).send("Cannot update payment")
    } else {
        res.status(200).send("Payment updated")
    }
}
const deletePayment = async (req, res) => {
    if (! await removePayment(req.params.id)) {
        res.status(500).send("Cannot delete payment")
    } else {
        res.status(200).send("Payment deleted")
    }
}

const getPaymentsForDriver = async (req,res) => {
    const payments = await retrievePaymentsForDriver(req.params.id_driver);
    res.status(200).json(payments)    
}

module.exports = {
    addPayment,
    getPayments,
    getPayment,
    updatePayment,
    deletePayment,
    getPaymentsForDriver
};
