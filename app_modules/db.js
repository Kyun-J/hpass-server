const mongoose = require('mongoose')
const crypto = require('crypto')

const code = require('./code')
const util = require('./util')

mongoose.connect('mongodb://localhost/hpass_db')

const UserSchema = new mongoose.Schema({
  name : { type : String , required : true },
  id : { type : String , required : true },
  type : { type : Number , required : true },
  phone : { type : Number, default : -1 },
  joinDate : { type : Date, default : Date.now },
  key : { type : String, required : true },
  token : { type : String, required : true, index : true },
  friends : [{
    id : { type : String , required : true },
    type : { type : Number , required : true }
  }],bolck : [{
    id : { type : String , required : true },
    type : { type : Number , required : true }
  }]
})
UserSchema.index({ id : 1, type : 1}, { unique : true })

const UserModel = mongoose.model('User',UserSchema)

exports.newUser = (req,res,next) => {
  newkey = crypto.randomBytes(64).toString('base64')
  newtoken = crypto.randomBytes(48).toString('base64')

  user = new UserModel({
    name : req.body.name,
    id : req.body.id,
    type : req.body.type,
    phone : req.body.phone,
    key : newkey,
    token : newtoken
  })
  user.save((err) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    }
    else {
      res.set('Content-Type', 'application/json; charset=utf-8')
      var data = {}
      data.key = newkey
      data.token = newtoken
      res.send(data)
      util.log("new User init")
    }
  })
}

exports.isUser = (id,type,callback) => {
  newtoken = crypto.randomBytes(48).toString('base64')
  UserModel.findOneAndUpdate({
    id : id,
    type : type
  }, { token : newtoken }, (err,one) => {
    if(err) {
      util.log(err)
      callback(code.dbErr)
    }
    else if(one === null || one === undefined) callback(code.notUser)
    else {
      data = {}
      data.key = one.key
      data.token = newtoken
      callback(data)
    }
  })
}

exports.simpleLogin = (req,res,next) => {
  newtoken = crypto.randomBytes(48).toString('base64')
  UserModel.findOneAndUpdate({
    token : req.body.user_token
  }, { token : newtoken }, (err,one) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    }
    else if(one === null || one === undefined) res.send(code.notUser)
    else {
      res.set('Content-Type', 'application/json; charset=utf-8')
      data = {}
      data.key = one.key
      data.token = newtoken
      res.send(data)
      util.log("user " + one.id + " do simpleLogin")
    }
  })
}
