const bodyparser = require('body-parser')
const express = require('express')

const db = require('./app_modules/db')
const util = require('./app_modules/util')
const login = require('./app_modules/login')
const friend = require('./app_modules/friend')
const chat = require('./app_modules/chat')
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

app.post('/kakaoLogin',login.kakaoLogin)
app.post('/googleLogin',login.googleLogin)
app.post('/simpleLogin',login.simpleLogin)

app.post('/newUser',user.newUser)
app.post('/fireUser',user.fireUser)

app.post('/getFriends',db.confirmUser,friend.getFriends)
app.post('/addFriend',db.confirmUser,friend.addFriend)
app.post('/addFrinedsByPhone',db.confirmUser,friend.addFrinedsByPH)
app.post('/blockFriend',db.confirmUser,friend.blockFriend)
app.post('/searchFriendByPH',db.confirmUser,friend.searchFriendByPH)
app.post('/searchFriendById',db.confirmUser,friend.searchFriendById)

app.post('/makeOnORoom',db.confirmUser,chat.makeOnORoom)
app.post('/makeGroupRoom',db.confirmUser,chat.makeGroupRoom)
app.post('/findMyRooms',db.confirmUser,chat.findMyRooms)
app.post('/findRoom',db.confirmUser,chat.findRoom)
app.post('/enterGroup',db.confirmUser,chat.enterGroup)

app.post('/appver',(req,res,next) => {
  res.set('Content-Type', 'application/json; charset=utf-8')
  res.send(util.getappver())
})

app.all('*',(req,res,next) => {
  res.sendStatus(403)
})
