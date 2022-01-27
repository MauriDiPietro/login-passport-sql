const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const {User} = require('./models/user.model');

//SIGNUP
passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, 
async(req, username, password, done)=>{
    //validar
    const user = await User.findOne({
        where: {
            username, 
            password
        }
    });
    if(!user){
        const userNew = await User.create({
            username,
            password
        });
        return done(null, userNew)  
    }
    return done(null, false)
}));

//SERIALIZACIÓN
passport.serializeUser((user, done)=>{
    done(null, user.id)
});

//DESERIALIZACIÓN
passport.deserializeUser(async(id, done)=>{
    const user = await User.findOne({
        where: {
            id
        }
    });
    done(null, user)
});

//SIGNIN
passport.use('local-login', new LocalStrategy(async (username, password, done)=>{
    const user = await User.findOne({
        where: {
            username, 
            password
        }
    })
    if(user){
       return done(null, user)
    }
    done(null, false)
}));

module.exports = {passport}