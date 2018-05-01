const request = require('request')

const util = require('./util')
const code = require('./code')
const db = require('./db')

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
      db.isKakaoUser(json.id, (msg) => {
        if(msg == code.dbErr) res.sendStatus(500)
        else if(msg == code.notUser) {
          res.set('Content-Type','text/plain')
          res.send(code.notUser)
        }
        else {
          res.set('Content-Type', 'application/json; charset=utf-8')
          res.json(msg)
        }
      })
    }
  })
}
