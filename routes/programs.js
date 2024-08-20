const express =  require('express');
const { addProgram, getPrograms, getProgram, updateProgram, deleteProgram, getProgramByAssociation } = require('../controllers/programs');
const router = express.Router()

router.route("/")
.get(getPrograms)
.post(addProgram)

router.route("/:id")
.get(getProgram)

.put(updateProgram)
.delete(deleteProgram)
router.route("/get_programs_by_association/:id")
.get(getProgramByAssociation)
module.exports = router;