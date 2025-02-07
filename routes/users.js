const express =  require('express');
const { 
    getUsers,
    addUser,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/users');

const { userValidationRules } = require('../middlewares/validationMiddleware');

const router = express.Router()

router.route("/")
.get(getUsers)
.post(userValidationRules,addUser)

router.route("/:id")
.get(getUser)
.put(updateUser)

router.route("/:label")
.delete(deleteUser)

module.exports = router;
