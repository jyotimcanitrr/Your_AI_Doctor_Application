const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const mongoose = require('mongoose');

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ 
      message: 'Error fetching departments',
      error: error.message 
    });
  }
});

// Get single department
router.get('/:id', async (req, res) => {
  try {
    // Check if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ 
      message: 'Error fetching department',
      error: error.message 
    });
  }
});

// Create department
router.post('/', async (req, res) => {
  try {
    const department = new Department({
      name: req.body.name,
      description: req.body.description,
      icon: req.body.icon,
      doctors: req.body.doctors
    });

    const newDepartment = await department.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(400).json({ 
      message: 'Error creating department',
      error: error.message 
    });
  }
});

// Update department
router.patch('/:id', async (req, res) => {
  try {
    // Check if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    if (req.body.name) department.name = req.body.name;
    if (req.body.description) department.description = req.body.description;
    if (req.body.icon) department.icon = req.body.icon;
    if (req.body.doctors) department.doctors = req.body.doctors;

    const updatedDepartment = await department.save();
    res.json(updatedDepartment);
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(400).json({ 
      message: 'Error updating department',
      error: error.message 
    });
  }
});

// Delete department
router.delete('/:id', async (req, res) => {
  try {
    // Check if id is valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.deleteOne();
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ 
      message: 'Error deleting department',
      error: error.message 
    });
  }
});

module.exports = router; 