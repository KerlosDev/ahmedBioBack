const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../modules/userModule');
const { validateUser } = require('../validator/userValid');
const { signUp, signIn, protect } = require('../services/authService');
const { getUserByIdService, updateUserbyId } = require('../services/userServise');


const router = express.Router();
 
router.get('/', protect, getUserByIdService);
router.put('/update', protect, updateUserbyId);

module.exports = router;
