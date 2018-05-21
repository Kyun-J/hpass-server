const request = require('request')
const googleAuth = require('google-auth-library')

const util = require('./util')
const code = require('./code')
const db = require('./db')
const key = require('/root/hpass/key')

const googleClient = new googleAuth.OAuth2Client(key.androidDebug)

const UserModel = db.UserModel

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
      Login(util.makeSid(json.id,code.kakao), (msg) => {
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
      Login(util.makeSid(login.getPayload().sub,code.google),(msg) => {
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

Login = (id,callback) => {
  newtoken = db.newPass()
  UserModel.findOneAndUpdate({
    _id : id
  }, {
    token : newtoken,
    permission : db.newPermission()
  }, (err,one) => {
    if(err) {
      util.log(err)
      callback(code.dbErr)
    }
    else if(one === null || one === undefined) callback(code.notUser)
    else {
      data = {}
      data.key = one.key
      data.name = one.name
      data.token = newtoken
      callback(data)
    }
  })
}

exports.simpleLogin = (req,res,next) => {
  newtoken = db.newPass()
  UserModel.findOneAndUpdate({
    token : req.body.user_token
  }, {
    token : newtoken,
    permission : db.newPermission()
  }, (err,one) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    }
    else if(one === null || one === undefined) res.status(503).send(code.userFail)
    else {
      data = {}
      data.key = one.key
      data.name = one.name
      data.token = newtoken
      res.send(data)
      util.log("user " + one.id + " do simpleLogin")
    }
  })
}
