const bodyparser = require('body-parser')
const express = require('express')

const util = require('./app_modules/util')
const app = express()

app.set(function(){app.use(express.bodyParser())})
app.use(bodyparser.urlencoded({extended:false}))

app.use(function(req,res,next) {
  req.reqtime = Date.now()
  res.on('finish',function() {
    util.mlog(req,res)
  })
  next()
})

app.listen(8008)

app.post('/topics',function(req,res,next) {
  res.set('Content-Type', 'application/json charset=utf-8')
  res.send(util.gettopics())
})

app.post('/appver',function(req,res,next) {
  res.set('Content-Type', 'application/json charset=utf-8')
  res.send(util.getappver())
})

app.all('*',function(req,res,next) {
  res.sendStatus(404)
})

function log(msg) {
  util.log(msg)
}
