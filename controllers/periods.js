const { 
    createPeriod,
    retrievePeriods,
    retrievePeriod,
    changePeriod,
    removePeriod,
    retrieveUnpaidPeriods,
    retrievePeriodsForCotisation
 } = require("../database/requests")

const addPeriod = async (req, res) => {
    const {label,id_cotisation} = req.body
    if (!await createPeriod(label,id_cotisation)) {
        res.status(500).send("Cannot create Period")
    } else {
        res.status(201).send("Period created")
    }
}


const getPeriods = async (req, res) => {
    let perms;
    if (req.query) {
        perms = await retrievePeriods(req.query)
    }else{
        perms = await retrievePeriods()
    }
    res.status(200).json(perms)
}

const getUnpaidPeriods = async (req,res) => {
   const { id_user,id_cotisation } = req.params

    let perms;
    if (req.query) {
        perms = await retrieveUnpaidPeriods(id_user, parseInt(id_cotisation))
    }else{
        perms = await retrieveUnpaidPeriods(id_user,parseInt(id_cotisation))
    }
    res.status(200).json(perms)    
}

const getPeriodsForCotisation = async (req, res) => {
    const perm = await retrievePeriodsForCotisation(parseInt(req.params.id_cotisation))
    res.status(200).json(perm)
}

const getPeriod = async (req, res) => {
    const perm = await retrievePeriod(req.params.id)
    res.status(200).json(perm)
}

const updatePeriod = async (req, res) => {
    const { label,id_cotisation } = req.body
    if (!await changePeriod(req.params.id,label,id_cotisation)) {
        res.status(500).send("Cannot update Period")
    } else {
        res.status(200).send("Period updated")
    }
}

const deletePeriod = async (req, res) => {
    if (!await removePeriod(req.params.id)) {
        res.status(500).send("Cannot delete Period")
    } else {
        res.status().send("Period deleted")
    }
}

module.exports = {
    addPeriod,
    getPeriods,
    getPeriod,
    updatePeriod,
    deletePeriod,
    getUnpaidPeriods,
    getPeriodsForCotisation
};