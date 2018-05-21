const cluster = require('cluster')
const os = require('os')

const util = require('./app_modules/util')

cluster.schedulingPolicy = cluster.SCHED_RR

cluster.setupMaster({
  exec : __dirname+'/worker.js'
})

os.cpus().forEach((cpu) => {
  cluster.fork()
})

cluster.on('exit',(worker,code,signal) => {
  util.log('woker ' + worker.id + ' is dead. restarting...')
  cluster.fork()
})

cluster.on('fork',(worker,code,signal) => {
  util.log('woker ' + worker.id + ' working start')
})
