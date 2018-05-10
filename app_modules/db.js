const mongoose = require('mongoose')
const crypto = require('crypto')
const code = require('./code')

mongoose.connect('mongodb://localhost/hpass_db')

const UserSchema = new mongoose.Schema({
  _id : { type : String , required : true },
  name : { type : String , required : true },
  phone : { type : String, default : "0" , index : true},
  joinDate : { type : Date, default : Date.now },
  key : { type : String, required : true },
  token : { type : String, required : true, unique : true },
  permission : { type : Number, default : -1},
  friends : [{
    _id : { type : String , required : true },
    phone : { type : String, default : "0"},
    block : { type : Boolean, default : false }
  }]
})

const expire = 24*60*60*1000

const UserModel = mongoose.model('User',UserSchema)

exports.UserModel = UserModel

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

exports.confirmUser = (token,callback) => {
  UserModel.findOne({
    token : token
  }, (err,one) => {
    if(err) {
      util.log(err)
      callback(code.dbErr)
    }
    else if(one === null || one === undefined) callback(code.userFail)
    else if(Date.now() > one.permission) callback(code.expireToken)
    else callback(code.dbOk,one)
  })
}
