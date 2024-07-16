// controllers/succursaleController.js
const {
    createSuccursale,
    getSuccursales,
    getSuccursaleById,
    updateSuccursale,
    deleteSuccursale,
  } = require('../database/requests.js');
  
  const createSuccursaleHandler = async (req, res) => {
    const { nom, association_id } = req.body;

    if (!association_id && !nom) {
        return res.status(400).json({ message: 'association_id and name is required' });
      }
  
    try {
      const succursale = await createSuccursale(nom, association_id);
      res.status(201).json(succursale);
    } catch (error) {
      console.error('Error creating succursale:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const getSuccursalesHandler = async (req, res) => {
    try {
      const succursales = await getSuccursales();
      res.status(200).json(succursales);
    } catch (error) {
      console.error('Error fetching succursales:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const getSuccursaleByIdHandler = async (req, res) => {
    const { id } = req.params;
  
    try {
      const succursale = await getSuccursaleById(parseInt(id));
      if (!succursale) {
        return res.status(404).json({ message: 'Succursale not found' });
      }
      res.status(200).json(succursale);
    } catch (error) {
      console.error('Error fetching succursale:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const updateSuccursaleHandler = async (req, res) => {
    const { id } = req.params;
    const { nom, association_id } = req.body;
  
    try {
      const succursale = await updateSuccursale(parseInt(id), nom, association_id);
      res.status(200).json(succursale);
    } catch (error) {
      console.error('Error updating succursale:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  const deleteSuccursaleHandler = async (req, res) => {
    const { id } = req.params;
  
    try {
      await deleteSuccursale(parseInt(id));
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting succursale:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = {
    createSuccursaleHandler,
    getSuccursalesHandler,
    getSuccursaleByIdHandler,
    updateSuccursaleHandler,
    deleteSuccursaleHandler,
  };
  