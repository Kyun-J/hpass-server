const bodyparser = require('body-parser')
const express = require('express')

const util = require('./app_modules/util')
const db = require('./app_modules/db')
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

app.get('/test1',(req,res,next) => {
  data = {}
  data.name = "test"
  data.email = "test"
  data.type = 0
  db.newUser(data,(msg) => {
    res.send(msg)
  })
})

app.get('/test2',(req,res,next) => {
  data = {}
  data.email = "test"
  data.type = 0
  db.findUser(data,(msg) => {
    res.send(msg)
  })
})

app.post('/appver',(req,res,next) => {
  res.set('Content-Type', 'application/json charset=utf-8')
  res.send(util.getappver())
})

app.all('*',(req,res,next) => {
  res.sendStatus(404)
})

function log(msg) {
  util.log(msg)
}
