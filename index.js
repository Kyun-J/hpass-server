const bodyparser = require('body-parser')
const express = require('express')

const util = require('./app_modules/util')
const login = require('./app_modules/login')
const friend = require('./app_modules/friend')
const user = require('./app_modules/user')
const code = require('./app_modules/code')

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
app.post('/googleLogin',login.googleLogin)
app.post('/simpleLogin',login.simpleLogin)

app.post('/newUser',user.newUser)
app.post('/fireUser',user.fireUser)
app.post('/findUserByPH',user.findUserByPH)

app.post('/findFriends',friend.findFriends)
app.post('/addFriend',friend.addFriend)
app.post('/addFrinedsByPhone',friend.addFrinedsByPH)
app.post('/blockFriend',friend.blockFriend)

app.post('/appver',(req,res,next) => {
  res.set('Content-Type', 'application/json; charset=utf-8')
  res.send(util.getappver())
})

app.all('*',(req,res,next) => {
  res.sendStatus(404)
})
