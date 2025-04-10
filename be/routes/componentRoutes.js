const express = require('express');
const router = express.Router();
const componentController = require('../controllers/componentController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/addComponent', authMiddleware, componentController.createComponent);
router.delete('/deleteComponent/:id', authMiddleware, componentController.deleteComponent);
router.get('/getComponents', authMiddleware, componentController.getComponents);
router.get('/getComponentsByUser/:userId', authMiddleware, componentController.getComponentsByUser);
router.put('/updateComponent/:id', authMiddleware, componentController.updateComponent);

module.exports = router;
