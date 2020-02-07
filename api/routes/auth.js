'use strict'

const router = require('express').Router()
const passport = require('passport')

/* GOOGLE STRATEGY */
router.get('/google', 
  passport.authenticate('google', { scope: ['email', 'profile'] })) // ['https://www.googleapis.com/auth/plus.login']

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err) { return next(err)}
    if (!user) { return res.redirect('/')}
        console.log('google credentials')
        console.log(user)
        res.redirect('/success?username='+ user.name)
  })(req, res, next)
})

/* MICROSFOT STRATEGY */
router.get('/azure_ad_oauth2',
      passport.authenticate('azure_ad_oauth2', { scope: ['openid', 'email', 'profile'] }))
 
router.get('/azure_ad_oauth2/callback', (req, res, next) => {
  passport.authenticate('azure_ad_oauth2', (err, user) => {
    if (err) { return next(err)}
    if (!user) { return res.redirect('/')}
    console.log('microsoft credentials')
    console.log(user)
    res.redirect('/success?username='+ user.name)
  })(req, res, next)
} )

module.exports = router