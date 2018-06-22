const util = require('./util')
const chat = require('./chat')

bin2String = (array) => {
  result = ""
  i = 0
  while(i < array.length) {
    c = array[i]
    if (c < 128) {
      result += String.fromCharCode(c)
      i++
    }
    else if((c > 191) && (c < 224)) {
      c2 = array[i+1]
      result += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
      i += 2
    }
    else {
      c2 = array[i+1]
      c3 = array[i+2]
      result += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
      i += 3
    }
  }
  return result
}

exports.mqttAnalyze = (topic,msg) => {
  Atopic = topic.split('/')
  Amsg = bin2String(msg.data).split('/')
  if(Atopic[1] == 'ir') {
    if(Amsg[2].indexOf('&') == -1) {
      chat.enterGroup(Amsg[0],Atopic[0])
    } else {
      member = Amsg[2].split(',')
      if(member.length == 3) {
        chat.makeOnORoom(member[0].split('&')[0],member[1].split('&')[0],Amsg[0])
      } else {
        makeM = []
        for(i = 0 ; i < member.length - 1 ; i++) {
          makeM[i] = { _id : member[i].split('&')[0] }
        }
        chat.makeGroup(Amsg[0],Amsg[1],makeM)
      }
    }
  } else if(Atopic[1] == 'er') {
    chat.exitRoom(Amsg[0],Atopic[0])
  }
}
