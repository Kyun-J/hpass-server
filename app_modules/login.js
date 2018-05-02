const request = require('request')
const googleAuth = require('google-auth-library')

const util = require('./util')
const code = require('./code')
const db = require('./db')
const key = require('/root/hpass/key')

const googleClient = new googleAuth.OAuth2Client(code.androidDebug)

exports.kakaoLogin = (req,res,next) => {
  request({
    url: 'https://kapi.kakao.com/v1/user/access_token_info',
	  headers: {
	    'Authorization': 'Bearer ' + req.body.access_token
	  }
  },(err,response,body) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    } else if(response.statusCode == 200) {
      json = JSON.parse(body)
      db.isUser(json.id,code.kakao, (msg) => {
        if(msg == code.dbErr) res.sendStatus(500)
        else if(msg == code.notUser) {
          res.set('Content-Type','text/plain')
          res.send(code.notUser)
        }
        else {
          res.set('Content-Type', 'application/json; charset=utf-8')
          res.send(msg)
        }
      })
    }
  })
}

exports.googleLogin = (req,res,next) => {
  googleClient.verifyIdToken({
    idToken : req.body.access_token,
    audience : key.googleClient
  }, (err,login) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    } else {
      db.isUser(login.getPayload().email,code.google, (msg) => {
        if(msg == code.dbErr) res.sendStatus(500)
        else if(msg == code.notUser) {
          res.set('Content-Type','text/plain')
          res.send(code.notUser)
        }
        else {
          res.set('Content-Type', 'application/json; charset=utf-8')
          res.send(msg)
        }
      })
    }
  })
}
