const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const ObjectID = require('mongodb').ObjectId;
require('dotenv').config();
const bcrypt = require('bcrypt');
let User = require('./models/user')

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

module.exports = function() {

    passport.serializeUser((user, done)=>{
        // console.log(user);
        done(null, user._id);
    })
    
    passport.deserializeUser((id, done)=>{
        User.findOne({ _id: new ObjectID(id) }, (err, doc) => {
          console.log(doc)
          done(null, doc);
        });
    })
    
    passport.use(new LocalStrategy(
        function(username, password, done){
            User.findOne({ username: username }, function(err, user){
                console.log('User '+ username + 'attempted to log in.');
                if(err) { return done(err); }
                if(!user) { return done(null, false); }
                if (!bcrypt.compareSync(password, user.password)) { 
                    return done(null, false); 
                }
                return done(null, user);
            })
        }
    ));

    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        scope: ['profile', 'email'],
        state: true
    },
    function(accessToken, refreshToken, profile, done){
        // db.collection('users').findOne({googleId: profile.id}).then(existingUser => {
        console.log(profile);
        // console.log('--------------------Req User------------------------')
        
        User.findOne({googleId: profile.id}).then(existingUser => {
            if (existingUser) {
                done(null, existingUser);
            } else {
                new User(
                    {
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails[0].value
                    }
                )
                .save().then(user => done(null, user));
            }
        });
    }
    ));
}