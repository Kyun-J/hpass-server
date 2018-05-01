const fs = require('fs')
const schedule = require('node-schedule')

exports.mlog = mlog
exports.log = log
exports.nowtime = nowtime
exports.nowdate = nowdate
exports.getappver = getappver
exports.gettopics = gettopics

function nowtime(){
  now = new Date();
  year = now.getFullYear();
  month= now.getMonth() + 1;
  if(month < 10){
    month = '0' + month;
  }
  date = now.getDate();
  if(date<10){
    date = '0' + date;
  }
  hour = now.getHours();
  if(hour<10){
    hour = '0' + hour;
  }
  min = now.getMinutes();
  if(min<10){
    min = '0' + min;
  }
  sec = now.getSeconds();
  if(sec<10){
    sec = '0' + sec;
  }

  var time = year + '-' + month + '-' + date + ' ' + hour + ':' + min + ':' + sec;
  return time;
}

function nowdate() {
	now = new Date();
	year = now.getFullYear();
	month= now.getMonth() + 1;
	if(month < 10){
		month = '0' + month;
	}
	date = now.getDate();
	if(date<10){
		date = '0' + date;
	}
	return year+'-'+month+'-'+date;
}

const path = '/root/hpass'
var accessLogStream
var appver
var topics

function set_log_config() {
  logfn = path + '/log/' + nowdate() + '.log'
  if (!(accessLogStream == undefined || accessLogStream == null)) accessLogStream.end()
  if(fs.existsSync(logfn)) accessLogStream = fs.createWriteStream(logfn,{flags : 'a'})
  else accessLogStream = fs.createWriteStream(logfn,{flags : 'w'})
}

function dataRead() {
  fs.readFile(path + '/data/appver.json','utf8',function(err,data) {
    if(err) {
      log('appver read error')
    } else {
      appver = data
    }
  })
  fs.readFile(path + '/data/topics.json','utf8',function(err,data) {
    if(err) {
      log('notice read error')
    } else {
      topics = data
    }
  })
}

function getappver() {
  return appver
}

function gettopics() {
  return topics
}

set_log_config()
dataRead()

setInterval(function() {dataRead()},30000)

schedule.scheduleJob({
  hour:0,
},function() {
  set_log_config()
})

function mlog(req,res) {
	delay = Date.now() - req.reqtime
	logm = nowtime() + req.connection.remoteAddress + ' ' + req.method + req.originalUrl + ' ' + res.statusCode + ' ' + delay
	if(!(accessLogStream == null || accessLogStream == undefined)) accessLogStream.write(logm+'\n')
	console.log(logm)
}

function log(msg) {
  logm = nowtime() + ' - ' + msg
	if(!(accessLogStream == null || accessLogStream == undefined)) accessLogStream.write(logm+'\n');
	console.log(logm);
}
