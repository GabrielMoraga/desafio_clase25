const express = require('express')
const exphbs = require('express-handlebars');
const session = require('express-session')
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('./api/userAPI');
const bCrypt = require('bcrypt')
;
/* ------------------ PASSPORT -------------------- */

passport.use('register', new LocalStrategy({
  passReqToCallback: true,
}, (req, username, password, done) => {

  User.listar({username}, (err, user) => {
    if(err) {
      console.log('Error en registro: ' + err);
      return done(err);
    }
    if(user) {
      console.log('El usuario ya existe');
      return done(null, false)
    }
  });

  const newUser = {
    username: username,
    password: createHash(password),
  }
  User.guardar(newUser, (err, userWithId) => {
    if (err) {
      console.log('Error in Saving user: ' + err);
      return done(err);
    }
    console.log(user)
    console.log('User Registration succesful');
    return done(null, userWithId);
  });
}));

function createHash(password) {
return bCrypt.hashSync(
         password,
         bCrypt.genSaltSync(10),
         null);
}

passport.use('login', new LocalStrategy(
  (username, password, done) => {
    User.listar({ username }, (err, user) => {
      if (err)
        return done(err);
 
      if (!user) {
        console.log('User Not Found with username ' + username);
        return done(null, false);
      }
 
      if (!isValidPassword(user, password)) {
        console.log('Invalid Password');
        return done(null, false);
      }
 
      return done(null, user);
    });
  })
 );

 function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
 } 

passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(function (user, done) {
  const usuario = user.listar(username)
  done(null, usuario);
});

/* --------------------- SERVER --------------------------- */

const app = express()

/* --------------------- MIDDLEWARE --------------------------- */

app.use(session({
  secret: 'shhhhhhhhhhhhhhhhhhhhh',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60000
  }
}))

app.use(passport.initialize());
app.use(passport.session());

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main.hbs' }));
app.set('view engine', '.hbs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

/* --------------------- AUTH --------------------------- */

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect('/login')
  }
}

function otroMiddleware(req, res, next) {
  if(req.session.user === 'admin'){
    next()
  }else {
    res.send('No estas autorizado')
  }
}

/* --------------------- ROUTES --------------------------- */

// REGISTER
app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/views/register.html')
})

app.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/' }))

app.get('/failregister', (req, res) => {
  res.render('register-error');
})

// LOGIN
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/login.html')
})

app.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/datos' }))

app.get('/faillogin', (req, res) => {
  res.render('login-error');
})

/* --------- LOGOUT ---------- */
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/')
})

/* --------- LISTEN ---------- */
const PORT = 8081
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
})
server.on("error", error => console.log(`Error en servidor: ${error}`))
