const util = require('./util')
const code = require('./code')
const db = require('./db')

const ChatModel = db.ChatModel
const UserModel = db.UserModel

exports.makeOnORoom = (uid,fid,rid) => {
  ChatModel.findOne({
    users : { $size : 2 },
    users : { $all : [{ '$elemMatch' : { _id : uid } }, { '$elemMatch' : { _id : fid } }] },
    isGroup : false
  }, (err,one) => {
    if(err) {
      log(err)
      res.sendStatus(500)
    }
    else if(!(one === null || one === undefined)) log(uid + ' ' + fid + ' OnORoom is already exist')
    else {
      room = new ChatModel({
        _id : rid,
        users : [{
          _id : uid
        }, {
          _id : fid
        }]
      })
      room.save((err) => {
        if(err) {
          log(err)
        } else {
          log('makeOnORoom ' + rid + ' suc')
        }
      })
    }
  })
}

exports.makeGroup = (rid,rname,member) => {
  ChatModel.findById(rid, (err,one) => {
    if(err) {
      log(err)
    }
    else if(!(one === null || one === undefined)) log(rid + ' is already exist')
    else {
      room = new ChatModel({
        _id : rid,
        name : rname,
        isGroup : true,
        users : member
      })
      room.save((err) => {
        if(err) {
          log(err)
        } else {
          log('makeGroup ' + rid + ' suc')
        }
      })
    }
  })
}

exports.enterGroup = (uid,rid) => {
  ChatModel.findById(rid, (err,one) => {
    if(err) {
      log(err)
    } else if(one.isGroup){
      one.users.push({ _id : uid })
      one.save((err) => {
        if(err) {
          log(err)
        } else {
          log(uid + ' enterGroup ' + rid + ' suc')
        }
      })
    }
  })
}

exports.exitRoom = (uid,rid) => {
  ChatModel.findOne({
    _id : rid,
    isGroup : false
  }, (err,one) => {
    if(err) log(err)
    else if(!(one === null || one === undefined)){
      UserModel.find({
        uid : { $in : [one.users[0]._id,one.users[1]._id] }
      },(err,users) => {
        if(err) log(err)
        else if((users === null || users === undefined) || users.length <= 1) {
          ChatModel.remove({ _id : rid },(err,one) => {
            if(err) {
              log(err)
            } else {
              log('room ' + rid + ' is removed')
            }
          })
        } else {
          log('both users are present')
        }
      })
    } else {
      ChatModel.findOneAndUpdate({
        _id : rid,
        users : { _id : uid },
        isGroup : true
      }, { $pull : { users : { _id : uid } } }, { new : true },
      (err,group) => {
        if(err) log(err)
        else if(!(group === null || group === undefined)) {
          log(uid + ' exitRoom ' + rid + ' suc')
          if(group.users.length == 0) {
            ChatModel.remove({ _id : rid },(err,one) => {
              if(err) {
                log(err)
              } else {
                log('room ' + rid + ' is removed')
              }
            })
          }
        } else {
          log(rid + ' not exist')
        }
      })
    }
  })
}

exports.findMyRooms = (req,res,next) => {
  ChatModel.find({
    users : { _id : req.userDone.uid }
  }, (err,rows) => {
    if(err) {
      log(err)
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
      log(err)
      res.sendStatus(500)
    } else {
      res.set('Content-Type', 'application/json; charset=utf-8')
      res.send(one)
    }
  })
}

const log = (msg) => {
  util.wlog(msg)
}
