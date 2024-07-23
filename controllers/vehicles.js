const { 
    createVehicle,
    retrieveVehicles,
    retrieveVehicle,
    changeVehicle,
    removeVehicle,
    retrieveVehiclesForUser
 } = require("../database/requests")

const addVehicle = async (req, res) => {
    if (!await createVehicle(req.body)) {
        res.status(500).send("Cannot create Vehicle");
    } else {
        res.status(201).send("Vehicle added");
    }
}
const getVehicles = async (req, res) => {
    let Vehicles;
    if (req.query) {
        Vehicles = await retrieveVehicles(req.query);
    } else {
        Vehicles = await retrieveVehicles()
    }
    res.status(200).json(Vehicles);
}
const getVehicle = async (req, res) => {
    const Vehicle = await retrieveVehicle(parseInt(req.params.id) );
    res.status(200).json(Vehicle);
}

const getVehiclesForUser = async (req, res) => {
    const vehicle = await retrieveVehiclesForUser(req.params.id_user);
    res.status(200).json(vehicle);
}

const updateVehicle = async (req, res) => {
    if (!await changeVehicle(parseInt(req.params.id), req.body)) {
        res.status(500).send("Cannot update Vehicle");        
    } else {
        res.status(200).send("Vehicle updated");
    }
}
const deleteVehicle = async (req, res) => {
    if (!await removeVehicle(parseInt(req.params.label) )) {
        res.status(500).send("Cannot delete Vehicle");        
    } else {
        res.status(200).send("Vehicle deleted");
    }
}

/**
 * Profile related functions
 */



module.exports = {
    addVehicle,
    getVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle,
    getVehiclesForUser 
};
