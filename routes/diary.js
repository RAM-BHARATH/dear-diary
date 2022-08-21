var express = require('express');
var router = express.Router();

const entry_controller = require('../controllers/entry_controller');
const category_controller = require('../controllers/category_controller')

const passport = require('passport');

const isLoggedIn = require('../middleware/isLoggedIn')


//// ENTRY ROUTES ////
/* GET entry home page. */

router.get('/', entry_controller.index);

router.get('/entry/create', isLoggedIn.isLoggedIn, entry_controller.entry_create_get);

router.post('/entry/create', isLoggedIn.isLoggedIn, entry_controller.entry_create_post);

router.get('/entry/:id/delete', isLoggedIn.isLoggedIn, entry_controller.entry_delete_get);

router.post('/entry/:id/delete', isLoggedIn.isLoggedIn, entry_controller.entry_delete_post);

router.get('/entry/:id/update', isLoggedIn.isLoggedIn, entry_controller.entry_update_get);

router.post('/entry/:id/update', isLoggedIn.isLoggedIn, entry_controller.entry_update_post);

router.get('/entry/:id', isLoggedIn.isLoggedIn, entry_controller.view_entry);

router.get('/entry', isLoggedIn.isLoggedIn, entry_controller.entry_list);

//// CATEGORY ROUTES ////
router.get('/category/create', isLoggedIn.isLoggedIn, category_controller.category_create_get);

router.post('/category/create', isLoggedIn.isLoggedIn, category_controller.category_create_post);

// router.get('/category/:id/delete', isLoggedIn.isLoggedIn, category_controller.category_delete_get);

// router.post('/category/:id/delete', isLoggedIn.isLoggedIn, category_controller.category_delete_post);

router.get('/category/:id/update', isLoggedIn.isLoggedIn, category_controller.category_update_get);

router.post('/category/:id/update', isLoggedIn.isLoggedIn, category_controller.category_update_post);

router.get('/category/:id', isLoggedIn.isLoggedIn, category_controller.category_detail);

router.get('/category', isLoggedIn.isLoggedIn, category_controller.category_list);

module.exports = router;