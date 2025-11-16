const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tasksController');

router.get('/', ctrl.getTasks);
router.post('/', ctrl.createTask);
router.put('/:id', ctrl.updateTask);
router.delete('/:id', ctrl.deleteTask);

module.exports = router;
