const cluster = require('cluster')
const os = require('os')

const MQTT = require('mqtt')
const mqtt = MQTT.connect('mqtt://127.0.0.1:1883',{
  clean : false,
  clientId : 'MainServer'
})

const util = require('./app_modules/util')

var mWorkers = []
var mIndex = 0

cluster.schedulingPolicy = cluster.SCHED_RR

cluster.setupMaster({
  exec : __dirname+'/worker.js'
})

os.cpus().forEach((cpu) => {
  cluster.fork()
})

cluster.on('exit',(worker,code,signal) => {
  for(i = 0; i < mWorkers.length ; i++) {
    if(mWorkers[i].id == worker.id) {
      mWorkers.splice(i,1)
      mIndex -= 1
      break
    }
  }
  util.log('woker ' + worker.process.pid + ' is dead. restarting...')
  cluster.fork()
})

cluster.on('fork',(worker,code,signal) => {
  util.log('woker ' + worker.process.pid + ' working start')
  mWorkers.push({ id : worker.id })
})


mqtt.on('connect',(connack) => {
  util.log('emqttd connect suc')
  mqtt.subscribe({ '+/ir' : 1, '+/er' : 1 })
})

mqtt.on('close', () => {
  util.log('emqttd disconnect')
})

mqtt.on('error', (e) => {
  util.log('eqmttd connect err' + e)
})

mqtt.on('message', (topic,message) => {
  if(mWorkers.length > 0) cluster.workers[mWorkers[mIndex].id].send([topic,message])
  if(mIndex + 1 >= mWorkers.length) mIndex = 0
  else mIndex += 1
})
