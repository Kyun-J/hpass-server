const util = require('./util')
const db = require('./db')
const code = require('./code')

const UserModel = db.UserModel

exports.newUser = (req,res,next) => {
  ph = req.body.phone
  ud = req.body.uid
  sd = req.body.sid
  UserModel.findOne({
    $or : [ { phone : ph }, { _id : sd }, { uid : ud }]
  }, (err,one) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    } else if(!(one === null || one === undefined)) {
      res.send(code.alreadyUser)
    } else {
      newkey = db.newPass()
      newtoken = db.newPass()

      user = new UserModel({
        _id : sd,
        uid : ud,
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
