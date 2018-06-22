const util = require('./util')
const code = require('./code')
const db = require('./db')
const chat = require('./chat')

const UserModel = db.UserModel

exports.getFriends = (req,res,next) => {
  res.set('Content-Type', 'application/json; charset=utf-8')
  res.send(req.userDone.friends)
}

exports.addFriend = (req,res,next) => {
  one = req.userDone
  one.friends.push({
    _id : req.body.friend_id,
    name : req.body.name,
    phone : req.body.phone})
  one.save((err) => {
    if(err) res.sendStatus(500)
    else res.sendStatus(200)
  })
}

exports.addFrinedsById = (req,res,next) => {
  data = JSON.parse(req.body.data)
  user = req.userDone
  friends = data.friends
  friends.forEach((value) => {
    UserModel.findOne({
      uid : value.uid
    }, (err,one) => {
      if(!err && !(one === null || one === undefined))
        user.friends.push({ _id : one._id, name : one.name, phone : one.phone})
    })
  })
  user.save((err) => {
    if(err) res.sendStatus(500)
    else res.send(user.friends)
  })
}

exports.addFrinedsByPH = (req,res,next) => {
  data = JSON.parse(req.body.data)
  user = req.userDone
  friends = data.friends
  friends.forEach((value) => {
    UserModel.findOne({
      phone : value.phone
    }, (err,one) => {
      if(!err && !(one === null || one === undefined))
        user.friends.push({ _id : one._id, name : value.name, phone : one.phone })
    })
  })
  user.save((err) => {
    if(err) res.sendStatus(500)
    else res.send(user.friends)
  })
}

exports.searchFriendByPH = (req,res,next) => {
  pn = req.body.phone
  if(pn != "0") {
    user = req.userDone
    UserModel.findOne({
      phone : pn
    }, (err,one) => {
      if(err) res.sendStatus(500)
      else if(one === null || one === undefined) res.sendStatus(200)
      else {
        res.set('Content-Type', 'application/json; charset=utf-8')
        data = {}
        data.id = one.uid
        data.name = one.name
        data.phone = one.phone
        data.isfriend = false
        for(i = 0 ; i < user.friends.length; i++) {
          if(one.phone == user.friends[i].phone) {
            data.isfriend = true
            break;
          }
        }
        res.send(data)
      }
    })
  }
}

exports.searchFriendById = (req,res,next) => {
  user = req.userDone
  UserModel.findOne({
    uid : req.body.friend_id
  }, (err,one) => {
    if(err) res.sendStatus(500)
    else if(one === null || one === undefined) res.sendStatus(200)
    else {
      res.set('Content-Type', 'application/json; charset=utf-8')
      data = {}
      data.id = one.uid
      data.name = one.name
      data.phone = one.phone
      data.isfriend = false
      for(i = 0 ; i < user.friends.length; i++) {
        if(one.phone == user.friends[i].phone) {
          data.isfriend = true
          break;
        }
      }
      res.send(data)
    }
  })
}

exports.blockFriend = (req,res,next) => {
  user = req.userDone
  user.findOneAndUpdate({ //수정필
    friends : { _id : req.body.friend_id }
  }, {
    $set : { 'friends.$.block' : true }
  }, (err,one) => {
    if(err) {
      util.wlog(err)
      res.sendStatus(500)
    }
    else
      res.sendStatus(200)
  })
}

exports.deleteFriend = (req,res,next) => {
  user = req.userDone
  fid = req.body.friend_id
  user.findOneAndUpdate({ //수정필요
    friends : { _id : fid }
  }, {
    $pull : { friends : { _id : fid } }
  }, (err,one) => {
    if(err) {
      util.wlog(err)
      res.sendStatus(500)
    }
    else
      res.sendStatus(200)
  })
}
