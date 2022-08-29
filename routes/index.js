var express = require('express');
var router = express.Router();

const entry_controller = require('../controllers/entry_controller');
const { route } = require('./diary');

const passport = require('passport')

router.get('/auth/google', passport.authenticate('google'));
/* GET home page. */
router.get('/auth/google/callback', passport.authenticate( 'google', 
{
  failureRedirect: '/auth/google/failure',
}), 
function(req, res){
  res.redirect('/diary')
} )

router.get('/protected', (req, res) => {
  res.json({response: req.session, user: req.user});
});

router.get('/logout', (req, res) => {
  req.logout(
    function(err){
      if(err){
        return next(err);
      }
      req.session.destroy();
      res.user={}
      res.redirect('/diary')
    }
  );
  // req.logout();
  // req.session.destroy();
  // res.send('Goodbye!');
});

router.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

router.get('/login', function(req, res, next){
  res.render('login')
})


router.get('/', function(req, res, next) {
  res.redirect('/diary');
});

router.get('/glogin', (req, res)=>{
  res.render('glogin')
})

module.exports = router;
