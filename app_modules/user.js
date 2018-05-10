const util = require('./util')
const db = require('./db')
const code = require('./code')

const UserModel = db.UserModel

exports.newUser = (req,res,next) => {
  ph = req.body.phone
  if(ph != -1) {
    UserModel.findOne({
      phone : ph
    }, (err,one) => {
      if(err) {
        util.log(err)
        res.sendStatus(500)
      } else if((!(one === null || one === undefined) && one.phone != "0")) {
        res.send(code.alreadyPH)
      } else {
        newkey = db.newPass()
        newtoken = db.newPass()

        user = new UserModel({
          _id : req.body.id,
          name : req.body.name,
          phone : req.body.phone,
          key : newkey,
          token : newtoken,
          permission : db.newPermission()
        })
        user.save((err) => {
          if(err) {
            util.log(err)
            res.sendStatus(500)
          } else {
            res.set('Content-Type', 'application/json; charset=utf-8')
            data = {}
            data.key = newkey
            data.token = newtoken
            res.send(data)
            util.log("new User init")
          }
        })
      }
    })
  }
}

exports.fireUser = (req,res,next) => {
  UserModel.remove({
    key : req.body.key,
    token : req.body.token
  }, (err) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    } else {
      res.sendStatus(200)
    }
  })
}
//$regex = 포함 찾기
exports.findUserByPH = (req,res,next) => {
  db.confirmUser(req.body.user_token, (msg,user) => {
    if(msg == code.dbErr) res.sendStatus(500)
    else if(msg != cod.dbOk) res.statud(503).send(msg)
    else {
      UserModel.findOne({
        phone : req.body.ph
      }, (err,one) => {
        if(err) {
          util.log(err)
          res.sendStatus(500)
        } else {
          res.set('Content-Type', 'application/json; charset=utf-8')
          data = {}
          data.id = one._id
          data.name = one.name
          res.send(data)
        }
      })
    }
  })
}
