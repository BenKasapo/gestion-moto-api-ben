const express =  require('express');
const { 
    getVehicles,
    addVehicle,
    getVehicle,
    updateVehicle,
    deleteVehicle
 } = require('../controllers/Vehicles');
const router = express.Router()

router.route("/")
.get(getVehicles)
.post(addVehicle)

router.route("/:id")
.get(getVehicle)
.put(updateVehicle)

router.route("/:label")
.delete(deleteVehicle)

module.exports = router;