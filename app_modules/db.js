const mongoose = require('mongoose')
const code = require('./code')
const util = require('./util')
mongoose.connect('mongodb://localhost/hpass_db')

const UserSchema = new mongoose.Schema({
  name : { type : String , required : true },
  email : { type : String , required : true , index : true },
  type : { type : Number , required : true , index : true },
  joinDate : Date,
  key : String
})

const UserModel = mongoose.model('User',UserSchema)

function newUser(data,callback) {
  user = new UserModel({
    name : data.name,
    email : data.email,
    type : data.type,
    joinDate : data.date
  })
  user.save((err) => {
    if(err) {
      util.log(err)
      callback(code.dberr)
    }
    else callback(code.done)
  })
}

function findUser(data,callback) {
  UserModel.findOne({
    email : data.email,
    type : data.type
  },(err,one) => {
    if(err) {
      util.log(err)
      callback(code.dberr)
    } else callback(one)
  })
}

exports.newUser = newUser
exports.findUser = findUser
