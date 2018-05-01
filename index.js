const bodyparser = require('body-parser')
const express = require('express')

const util = require('./app_modules/util')
const db = require('./app_modules/db')
const login = require('./app_modules/login')
const app = express()

app.set(() => {app.use(express.bodyParser())})
app.use(bodyparser.urlencoded({extended:false}))

app.use((req,res,next) => {
  req.reqtime = Date.now()
  res.on('finish',function() {
    util.mlog(req,res)
  })
  next()
})

app.listen(8008)

util.log('server start...')

app.post('/kakaoLogin',login.kakaoLogin)
app.post('/simpleLogin',db.simpleLogin)
app.post('/newUser',db.newUser)

app.post('/appver',(req,res,next) => {
  res.set('Content-Type', 'application/json charset=utf-8')
  res.send(util.getappver())
})

app.all('*',(req,res,next) => {
  res.sendStatus(404)
})
