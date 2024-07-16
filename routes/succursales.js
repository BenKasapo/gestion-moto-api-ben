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

router.post('/', createSuccursaleHandler);
router.get('/', getSuccursalesHandler);
router.get('/:id', getSuccursaleByIdHandler);
router.put('/:id', updateSuccursaleHandler);
router.delete('/:id', deleteSuccursaleHandler);

module.exports = router;
