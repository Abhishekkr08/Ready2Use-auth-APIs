const express = require('express');
const router = express.Router();
const appControllers = require('../controllers/controller.js');
const middleware = require('../middleware/auth')


router.get('/home',middleware, appControllers.homepage)

router.post('/register', appControllers.signup);

router.get('/verify-email',appControllers.verifyEmail);

router.post('/login', appControllers.signin);

router.post('/upload', appControllers.uploadImage);

router.get('/:id', appControllers.getImage);


// responses for all the requests whose url doenst exists
router.get('*', appControllers.wrnURL)


module.exports = router;