const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const mongoClient = require('./clients/mongoDB')
const auth = require('./routes/auth')
const index = require('./routes/index')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const MicrosoftStrategy = require('passport-azure-ad-oauth2').Strategy
const HttpsProxyAgent = require('https-proxy-agent')
const UserDetails = require('./models/UserDetails')
const cors = require('cors')

require('dotenv').config()

const port = process.env.PORT || 3000
console.log('port: ', port)
const app = express()

app.set('trust proxy', 1) // trust first proxy always

app.use(bodyParser.urlencoded({ extended: true }))

/* PASSPORT */
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function(user, cb) {
  console.log('serializing user.')
  cb(null, user.id)
})

passport.deserializeUser(function(user, cb) {
  console.log('deserialize user.')
  cb(null, user.id)
  /*User.findById(id, function(err, user) {
    cb(err, user)
  })*/
})

/* PASSPORT LOCAL AUTHENTICATION */
passport.use(new LocalStrategy(
  function(username, password, done) {
      UserDetails.findOne({
        username: username
      }, function(err, user) {
        if (err) {
          return done(err)
        }

        if (!user) {
          return done(null, false)
        }

        if (user.password != password) {
          return done(null, false)
        }
        return done(null, user)
      })
  }
))

/* PASSPORT GOOGLE AUTHENTICATION */
const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/auth/google/callback"
} ,
(accessToken, refreshToken, profile, cb, done) => {
  console.log('id: ', cb.id)
    var data = {
      id: cb.id,
      name: cb.displayName,
      email: cb.emails[0].value,
      emailVerified: cb.emails[0].verified
    }
    console.log('data: ', data)
    return done(null, data)
  }
)

passport.use(googleStrategy)

/* PASSPORT MICROSOFT AUTHENTICATION */
const microsoftStrategy = new MicrosoftStrategy({
  /*clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,*/
  clientID: process.env.DIRECTORY_CLIENT_ID,
  clientSecret: process.env.DIRECTORY_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/auth/azure_ad_oauth2/callback",
  //resource: '4a52105b-a80e-4369-9534-00822c37b1a8',
  tenant: 'jlmenen8hotmail.onmicrosoft.com'
} ,
(accessToken, refreshToken, params, cb, done) => {
  const userProfile = jwt.decode(params.id_token)
  console.log('id: ', userProfile)
/*    var data = {
      id: cb.id,
      name: cb.displayName,
      email: cb.emails[0].value,
      emailVerified: cb.emails[0].verified
    }
    console.log('data: ', data)*/
    return done(null, userProfile)
  }
)

if (process.env['https_proxy']) {
    console.log('entra: ', process.env['https_proxy'])
    const httpsProxyAgent = new HttpsProxyAgent(process.env['https_proxy'])
    googleStrategy._oauth2.setAgent(httpsProxyAgent)
    microsoftStrategy._oauth2.setAgent(httpsProxyAgent)
}
  
passport.use(microsoftStrategy)

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    default: 'http://localhost:3000'
}

app.use(cors(corsOptions))

app.use(function(req, res, next) {
  let origin = req.headers.origin

console.log('origin: ', origin)
  if(corsOptions.origin.indexOf(origin) >= 0){
      res.header("Access-Control-Allow-Origin", origin || '*')
  }

  res.header("Access-Control-Allow-Credentials", true)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use('/auth', auth)
app.use('/', index)





/* PASSPORT MICROSOFT AUTHENTICATION */
/*
const MicrosoftStrategy = require('passport-microsoft').Strategy
const microsoftStrategy = new MicrosoftStrategy({
  clientID: process.env.MICROSOFT_CLIENT_ID,
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/auth/microsoft/callback"
} ,
(accessToken, refreshToken, profile, cb, done) => {
  console.log('id: ', cb.id)
    var data = {
      id: cb.id,
      name: cb.displayName,
      email: cb.emails[0].value,
      emailVerified: cb.emails[0].verified
    }
    console.log('data: ', data)
    return done(null, data)
  }
)

if (process.env['https_proxy']) {
  console.log('entra: ', process.env['https_proxy'])
  const httpsProxyAgent = new HttpsProxyAgent(process.env['https_proxy'])
  microsoftStrategy._oauth2.setAgent(httpsProxyAgent)
}
*/


/* LOCAL STRATEGY */
app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"))
app.get('/error', (req, res) => res.send("error logging in"))

/* GOOGLE STRATEGY */
/*
app.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })) // ['https://www.googleapis.com/auth/plus.login']

app.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err) { return next(err)}
    if (!user) { return res.redirect('/')}
    console.log('google credentials')
    console.log(user)
    res.redirect('/success?username='+ user.name)
  })(req, res, next)
} )
*/
/* MICRSOSOFT STRATEGY */
/*
app.get('/auth/microsoft',
      passport.authenticate('microsoft', { scope: ['openid', 'email', 'profile'] }))
 
app.get('/auth/microsoft/callback', 
(req, res, next) => {
  passport.authenticate('microsoft', (err, user) => {
    if (err) { return next(err)}
    if (!user) { return res.redirect('/')}
    console.log('microsoft credentials')
    console.log(user)
    res.redirect('/success?username='+ user.name)
  })(req, res, next)
} )
*/

app.listen(port , () => console.log('App listening on port ' + port))