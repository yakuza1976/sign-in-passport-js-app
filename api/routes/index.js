'use strict'

const router = require('express').Router()
const path = require('path')
const passport = require('passport')

router.get('/', (req, res) => {
    res.sendFile('auth.html', { root: path.join(__dirname, '../public')})
})

router.post('/',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success?username='+req.user.username)
  }) 

module.exports = router