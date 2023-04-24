const express = require('express');
const router = new express.Router();
const auth = require('../../middleware/auth');


const {create_user,verify,sendPasswordResetLinkUser,resetUserPassword, user_login, blind_data,   deaf_data,
    other_data} = require('../user/userController')
// Create new buyer
router.post('/api/createUser', create_user);

//to verify main
router.post('/api/verifyUser/:user_id', auth.is_user, verify);

// Create new buyer
router.post('/api/sendUserPasswordReset', sendPasswordResetLinkUser);

//to verify main
router.post('/api/:password_reset_id/resetUserPassword/:otp', resetUserPassword);

router.get('/api/blind', blind_data);
router.get('/api/deaf', deaf_data);
router.get('/api/other', other_data);


// // Create new user
// router.post('/api/createUser', auth.is_user, create_user);

// User signin
router.post('/api/userLogin', user_login);



module.exports = router;
