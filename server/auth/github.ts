import { config } from 'dotenv'
import express from 'express'
import passport from 'passport'
import { Strategy } from 'passport-github2'

config()

export const router = express.Router()

passport.use(new Strategy({
    clientID: process.env.ONYXMD_GITHUB_ID,
    clientSecret: process.env.ONYXMD_GITHUB_SECRET,
    callbackURL: 'http://localhost:3000/github/auth',
  }, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      return done(null, profile)
    })
  }))

router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
  }))
router.get('/github/auth', passport.authenticate('github', {
    failureRedirect: '/login',
    successRedirect: '/',
}))
