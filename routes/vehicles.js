const express =  require('express');
const { 
    getVehicles,
    addVehicle,
    getVehicle,
    updateVehicle,
    deleteVehicle,
    getVehiclesForUser
 } = require('../controllers/vehicles');
const router = express.Router()

router.route("/")
.get(getVehicles)
.post(addVehicle)

router.route("/:id")
.get(getVehicle)
.put(updateVehicle)

router.route("/:label")
.delete(deleteVehicle)

router.route("/get_vehicles_for_user/:id_user")
.get(getVehiclesForUser)


module.exports = router;