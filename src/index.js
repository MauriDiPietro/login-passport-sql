const express = require('express');
const {User} = require('./models/user.model');  //creación tabla
const passport = require('passport');
const configPassport = require('./passport');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

//DB
const {db} = require('./db');

const app = express();

//SESSION
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));

//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended:false}));

const auth = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect('/login')
    }
}

//ROUTES
app.get('/home', auth, (req, res)=>{
    // console.log(req.user)
    res.render('profile', {user: req.user.username}) //usuario deserializado
});

app.get('/login', (req, res)=>{
    res.render('login');
    // console.log(req.session)
    // console.log(req.user)
});

app.get('/signup', (req, res)=>{
    res.render('signup')
});


app.get('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/login')
});

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/signup'
}));

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/home',
    failureRedirect: '/login'
}));

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    db.sync({force:false})
    .then(()=>{
        console.log('Base de datos conectada!')
        
    })
    .catch(()=>{
        console.log('Error al conectarse')
    })
        console.log(`Server OK en puerto ${PORT}!`)
});