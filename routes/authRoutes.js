const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../modules/userModule');
const { validateSignUp, validateSignIn } = require('../validator/userValid');
const { signUp, signIn, protect, isAdmin } = require('../services/authService');
const { getUserByIdService } = require('../services/userServise');


const router = express.Router();

router.post('/signup', validateSignUp, signUp);
router.post('/signin', validateSignIn, signIn);
router.get('/user', protect, isAdmin, getUserByIdService);
module.exports = router;
