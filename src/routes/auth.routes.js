const express = require('express');
const { signupHandler, loginHandler } = require('../controllers/auth.controller');
const { setPasswordHandler, setPasswordSchema } = require('../controllers/setPassword.controller');
const validate = require('../middlewares/validate.middleware');
const { signupSchema, loginSchema } = require('../validations/auth.validation');

const router = express.Router();

router.post('/signup', validate(signupSchema), signupHandler);
router.post('/login', validate(loginSchema), loginHandler);
router.post('/set-password', validate(setPasswordSchema), setPasswordHandler);

module.exports = router;
