const mongoose = require('mongoose')
const crypto = require('crypto')
const code = require('./code')

mongoose.connect('mongodb://localhost/hpass_db')

const UserSchema = new mongoose.Schema({
  _id : { type : String , required : true },
  uid : { type : String , required : true , unique : true},
  name : { type : String , required : true },
  phone : { type : String, default : "0" , index : true},
  joinDate : { type : Date, default : Date.now },
  key : { type : String, required : true },
  token : { type : String, required : true, unique : true },
  permission : { type : Number, default : -1},
  friends : [{
    _id : { type : String , required : true },
    name : { type : String, required: true },
    phone : { type : String, default : "0"},
    block : { type : Boolean, default : false }
  }]
})

const ChatSchema = new mongoose.Schema({
  _id : { type : String, required : true },
  name : { type : String },
  isGroup : { type : Boolean, default : false },
  users : [{
    _id : { type : String , required : true }
  }]
})

const UserModel = mongoose.model('User',UserSchema)
const ChatModel = mongoose.model('Chat',ChatSchema)

const expire = 24*60*60*1000

exports.UserModel = UserModel
exports.ChatModel = ChatModel

exports.isExpire = (time) => {
  if(Date.now() > time) return true
  else return false
}

exports.newPermission = () => {
  result = Date.now() + expire
  return result
}

exports.newPass = () => {
  result = crypto.randomBytes(64).toString('base64')
  return result
}

exports.confirmUser = (req,res,next) => {
  UserModel.findOne({
    token : req.body.token
  }, (err,one) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    }
    else if(one === null || one === undefined) res.status(202).send(code.userFail)
    else if(Date.now() > one.permission) res.status(202).send(code.expireToken)
    else {
      req.userDone = one
      next()
    }
  })
}
