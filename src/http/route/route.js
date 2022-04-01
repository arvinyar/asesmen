const express = require('express');
const authController = require('../../logic/auth/auth.controller');
const usersController = require('../../logic/user/user.controller');
const transactionController = require('../../logic/transaction/transaction.controller');
const productsController = require('../../logic/products/products.controller');
//const cartController = require('../../logic/cart/cart.controller');

const { JWTMiddleware } = require('../middleware/JWT.middleware');
const { DatabaseMiddleware } = require('../middleware/database.middleware');
const { apikeyMiddleware } = require('../middleware/apikey.middleware');
const { emailMiddleware } = require('../middleware/email.middleware');
const { passwordMiddleware } = require('../middleware/password.middleware');

const router = express.Router();

const ac = new authController();
const uc = new usersController();
const tc = new transactionController();
const pc = new productsController();
//const cc = new cartController();

router.post('/register', DatabaseMiddleware, apikeyMiddleware, emailMiddleware, passwordMiddleware, ac.register);
router.post('/login', DatabaseMiddleware, apikeyMiddleware, emailMiddleware, passwordMiddleware, ac.auth);
router.get('/getprofile', DatabaseMiddleware, JWTMiddleware, apikeyMiddleware, uc.profile);
router.post('/addtocart', DatabaseMiddleware, JWTMiddleware, apikeyMiddleware, tc.add_cart);
router.get('/view/:status', DatabaseMiddleware, JWTMiddleware, apikeyMiddleware, tc.view_cart);
router.post('/deletefromcart', DatabaseMiddleware, JWTMiddleware, apikeyMiddleware, tc.delete_cart);
router.post('/checkout', DatabaseMiddleware, JWTMiddleware, apikeyMiddleware, tc.checkout);
router.post('/pay', DatabaseMiddleware, JWTMiddleware, apikeyMiddleware, tc.pay);
router.post('/find', DatabaseMiddleware, JWTMiddleware, apikeyMiddleware, pc.find);
//router.get('/cekcart', DatabaseMiddleware, JWTMiddleware, apikeyMiddleware, tc.cek_cart);
//router.get('/cekcheckout', DatabaseMiddleware, JWTMiddleware, apikeyMiddleware, tc.cek_checkout);

module.exports = router
