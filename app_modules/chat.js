const util = require('./util')
const code = require('./code')
const db = require('./db')

const ChatModel = db.ChatModel

exports.makeOnORoom = (req,res,next) => {
  user = req.userDone
  uid = user.uid
  fid = req.body.friend_id
  ChatModel.findOne({
    users : { $size : 2 },
    users : { $all : [{ '$elemMatch' : { _id : uid } }, { '$elemMatch' : { _id : fid } }] }
  }, (err,one) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    }
    else if(!(one === null || one === undefined)) res.status(202).send(code.alreadyChat)
    else {
      room = new ChatModel({
        _id : req.body.RoomId,
        users : [{
          _id : uid
        }, {
          _id : fid
        }]
      })
      room.save((err) => {
        if(err) {
          util.log(err)
          res.sendStatus(500)
        } else {
          res.sendStatus(200)
        }
      })
    }
  })
}

exports.makeGroupRoom = (req,res,next) => {
  member = JSON.parse(req.body.member)
  rid = req.body.RoomId
  ChatModel.findById(rid, (err,one) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    }
    else if(!(one === null || one === undefined)) res.status(202).send(code.alreadyChat)
    else {
      room = new ChatModel({
        _id : rid,
        name : req.body.RoomName,
        isGroup : true,
        users : member
      })
      room.save((err) => {
        if(err) {
          util.log(err)
          res.sendStatus(500)
        } else {
          res.sendStatus(200)
        }
      })
    }
  })
}

exports.findMyRooms = (req,res,next) => {
  ChatModel.find({
    'users._id' : req.userDone.uid
  }, (err,rows) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    } else {
      res.set('Content-Type', 'application/json; charset=utf-8')
      res.send(rows)
    }
  })
}

exports.findRoom = (req,res,next) => {
  ChatModel.findById(req.body.RoomId, (err,one) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    } else {
      res.set('Content-Type', 'application/json; charset=utf-8')
      res.send(one)
    }
  })
}

exports.enterGroup = (req,res,next) => {
  ChatModel.findById(req.body.RoomId, (err,one) => {
    if(err) {
      util.log(err)
      res.sendStatus(500)
    } else {
      one.users.push({ _id : req.userDone.uid })
      one.save((err) => {
        if(err) {
          util.log(err)
          res.sendStatus(500)
        } else {
          res.sendStatus(200)
        }
      })
    }
  })
}
