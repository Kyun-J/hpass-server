const fs = require('fs')
const schedule = require('node-schedule')

nowtime = () => {
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

nowdate = () => {
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

set_log_config = () => {
  logfn = path + '/log/' + nowdate() + '.log'
  if (!(accessLogStream == undefined || accessLogStream == null)) accessLogStream.end()
  if(fs.existsSync(logfn)) accessLogStream = fs.createWriteStream(logfn,{flags : 'a'})
  else accessLogStream = fs.createWriteStream(logfn,{flags : 'w'})
}

dataRead = () => {
  fs.readFile(path + '/data/appver.json','utf8',(err,data) => {
    if(err) {
      log('appver read error')
    } else {
      appver = data
    }
  })
}

const getappver = () => {
  return appver
}

set_log_config()
dataRead()

setInterval(() => {dataRead()},30000)

schedule.scheduleJob({
  hour:0,
},() => {
  set_log_config()
})

mlog = (req,res) => {
	delay = Date.now() - req.reqtime
	logm = nowtime() + req.connection.remoteAddress + ' ' + req.method + req.originalUrl + ' ' + res.statusCode + ' ' + delay
	if(!(accessLogStream == null || accessLogStream == undefined)) accessLogStream.write(logm+'\n')
	console.log(logm)
}

log = (msg) => {
  logm = nowtime() + ' - ' + msg
	if(!(accessLogStream == null || accessLogStream == undefined)) accessLogStream.write(logm+'\n');
	console.log(logm);
}

exports.makeSid = (id,code) => {
  return code+'&'+id
}

exports.mlog = mlog
exports.log = log
exports.nowtime = nowtime
exports.nowdate = nowdate
exports.getappver = getappver
