const util = require('./util')
const code = require('./code')
const db = require('./db')

const UserModel = db.UserModel

exports.findFriends = (req,res,next) => {
  UserModel.findOne({
    token : req.body.user_token
  }, (err,data) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    }
    else if(one === null || one === undefined) res.status(503).send(code.userFail)
    else if(db.isExpire(one.permission)) res.status(503).send(code.expireToken)
    else {
      res.set('Content-Type', 'application/json; charset=utf-8')
      res.send(data.friends)
    }
  })
}

exports.addFriend = (req,res,next) => {
  db.confirmUser(req.body.user_token, (msg,one) => {
    if(msg == code.dbErr) res.sendStatus(500)
    else if(msg != code.dbOk) res.status(503).send(msg)
    else {
      one.friends.push({ _id : req.body.friend_id, phone : req.body.phone})
      one.save((err) => {
        if(err) res.sendStatus(500)
        else res.sendStatus(200)
      })
    }
  })
}

exports.addFrinedsById = (req,res,next) => {
  data = JSON.parse(req.body.data)
  db.confirmUser(data.user_token, (msg,user) => {
    if(msg == code.dbErr) res.sendStatus(500)
    else if(msg != code.dbOk) res.status(503).send(msg)
    else {
      f_ids = data.friends
      f_ids.forEach((value) => {
        UserModel.findOne({
          _id : value
        }, (err,one) => {
          if(!err && !(one === null && one === undefined))
            user.friends.push({ _id : one._id, phone : one.phone})
        })
      })
      user.save((err) => {
        if(err) res.sendStatus(500)
        else res.send(user.friends)
      })
    }
  })
}

exports.addFrinedsByPH = (req,res,next) => {
  data = JSON.parse(req.body.data)
  db.confirmUser(data.user_token, (msg,user) => {
    if(msg == code.dbErr) res.sendStatus(500)
    else if(msg != code.dbOk) res.status(503).send(msg)
    else {
      f_tels = data.friends
      f_tels.forEach((value) => {
        UserModel.findOne({
          phone : value
        }, (err,one) => {
          if(!err && !(one === null && one === undefined))
            user.friends.push({ _id : one._id, phone : one.phone})
        })
      })
      user.save((err) => {
        if(err) res.sendStatus(500)
        else res.send(user.friends)
      })
    }
  })
}

exports.blockFriend = (req,res,next) => {
  db.confirmUser(req.body.user_token, (msg,user) => {
    if(msg == code.dbErr) res.sendStatus(500)
    else if(msg != code.dbOk) res.status(503).send(msg)
    else {
      user.findOneAndUpdate({
        'friends._id' : req.body.friend_id
      }, {
        $set : { 'friends.$.block' : true }
      }, (err,one) => {
        if(err) {
          util.log(err)
          res.sendStatus(500)
        }
        else
          res.sendStatus(200)
      })
    }
  })
}

exports.deleteFriend = (req,res,next) => {
  db.confirmUser(req.body.user_token, (msg,user) => {
    if(msg == code.dbErr) res.sendStatus(500)
    else if(msg != code.dbOk) res.status(503).send(msg)
    else {
      user.findOneAndUpdate({
        'friends._id' : req.body.friend_id
      }, {
        $pull : { 'friends._id' : req.body.friend_id }
      }, (err,one) => {
        if(err) {
          util.log(err)
          res.sendStatus(500)
        }
        else
          res.sendStatus(200)
      })
    }
  })
}
