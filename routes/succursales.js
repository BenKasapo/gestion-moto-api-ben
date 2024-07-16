// routes/succursaleRoutes.js
const express = require('express');
const {
  createSuccursaleHandler,
  getSuccursalesHandler,
  getSuccursaleByIdHandler,
  updateSuccursaleHandler,
  deleteSuccursaleHandler,
} = require('../controllers/succursales');
const router = express.Router();

router.route('/')
.get( getSuccursalesHandler)
.post(createSuccursaleHandler);

router.route('/:id', getSuccursaleByIdHandler)
.get(getSuccursaleByIdHandler)
.put(updateSuccursaleHandler)
.delete(deleteSuccursaleHandler);


module.exports = router;
