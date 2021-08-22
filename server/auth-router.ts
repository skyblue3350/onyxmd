import { config } from 'dotenv'
import express from 'express'
import passport from 'passport'
import { router as GitHubRouter } from './auth/github'

config()

export const router = express.Router()

passport.serializeUser(function(user, done) {
  done(null, user)
})
passport.deserializeUser(function(user, done) {
  done(null, user)
})

const isGitHubEnabled = process.env.ONYXMD_ENABLED

if (isGitHubEnabled) router.use(GitHubRouter)

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})
