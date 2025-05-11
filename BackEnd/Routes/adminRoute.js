const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/activity-log/download', adminController.downloadActivityLogPdf);
router.get('/users', adminController.getAllUsers);
router.post('/login', adminController.adminLogin);
router.get('/activity-summary', adminController.getActivitySummary);

module.exports = router;
