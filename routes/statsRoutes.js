const express = require('express');
const router = express.Router();
 const { protect } = require('../services/authService');
const { getStudentStats } = require('../services/statsService');

router.get('/user-stats', protect, getStudentStats);

module.exports = router;
