const child_process = require('child_process')

const player = {}

const METHODS = {
  INIT: 'init',
  PAUSE: 'pause',
  PLAY: 'play',
  GET_TIME: 'getTime',
  SET_TIME: 'setTime',
  GET_LENGTH: 'getLength',
  GET_VOLUME: 'getVolume',
  SET_VOLUME: 'setVolume',
  VOLUME_UP: 'volumeUp',
  VOLUME_DOWN: 'volumeDown',
}

player.tasks = []
player.data = ''
player.methods = []
player.vlcProcess = {}
player.context = {}

function sanitizeServerFeedback (bufferData) {
  /* Sanitize server feedback */
  /* (remove every trailing '> ') */
  return bufferData.replace(new RegExp(/^> /, 'm'), '')
}

function handleServerFeedback (tasks, data) {
  console.log('=== Start handleServerFeedback ===')

  let buffer = ''
  /* I think we need to bufferize the data */
  /* And consume it whenever needed */
  for (let c of data) {
    buffer += String.fromCharCode(c)
  }

  console.log('Original data: [' + buffer + ']')
  let sanitizedData = sanitizeServerFeedback(buffer)
  console.log('Sanitized data: ['+ sanitizedData + ']')
  player.data += sanitizedData
  
  console.log('Tasks to do: ' + JSON.stringify(player.tasks))
  console.log('Data: ' + JSON.stringify(player.data))

  for (let task of tasks) {
    console.log('Execute: ' + task)

    let end = player.methods[task](player.data)
    if (end.result === false) break;

    /* If the function succeeded we can remove it from the pending tasks */
    player.tasks.shift()
    /* And it has consume the relevant data, so we remove them too */
    player.data = end.data
  }

  console.log('Pending tasks: ' + JSON.stringify(player.tasks))
  console.log('Pending data: ' + JSON.stringify(player.data))
  console.log('===  End  handleServerFeedback ===')
}

function initContext () {
  player.context.title = ''
  player.context.isPlaying = true
  player.context.volume = 0
  player.context.time = 0
  player.context.length = 0

  player.context.tracks = {}
  player.context.tracks.video = []
  player.context.tracks.audio = []
  player.context.tracks.subtitle = []
}

function startVLC (filename) {
  /* Spawn VLC process */
  player.vlcProcess = child_process.spawn('vlc',
			      [ filename, '--fullscreen', '--play-and-exit', '-I rc' ])
  
  /* Record player's stdout callback function */
  player.vlcProcess.stdout.on('data', (data) => handleServerFeedback(player.tasks, data))

  player.tasks.push(METHODS.INIT)
  
  /* Start media in pause mode */
  player.pause()
  
  /* Get media informations */
  setTimeout(getMediaInformations, 1000)
}

function getMediaInformations () {
  player.getLength()
}

player.start = function (playerName, filename) {
  initContext()
  startVLC(filename)
  console.log('TODO : Start player')
}

player.pause = function () {
  player.tasks.push(METHODS.PAUSE)
  player.vlcProcess.stdin.write('pause\r\n')
}

player.play = function () {

}

player.getTime = function () {

}

player.setTime = function (time) {

}

player.getLength = function () {
  player.tasks.push(METHODS.GET_LENGTH)
  player.vlcProcess.stdin.write('get_length\r\n')
}

player.getVolume = function () {

}

player.setVolume = function (volume) {
}

player.volumeUp = function () {

}

player.volumeDown = function () {

}

player.mute = function () {
  player.setVolume(0)
}


player.methods[METHODS.INIT] = function (data) {
  let safeguard = "Command Line Interface initialized. Type `help' for help.\r\n"

  let returnedResult = false
  let returnedData = data

  let pos = data.indexOf(safeguard)
  if (pos > -1) {
    returnedResult = true
    returnedData = data.substr(pos + safeguard.length)
  }

  return { result: returnedResult, data: returnedData }
}

player.methods[METHODS.PAUSE] = function (data) {
  let returnedData = data

  player.context.isPlaying = !player.context.isPlaying

  return { result: true, data: returnedData }
}

player.methods[METHODS.PLAY] = function (data) {

}

player.methods[METHODS.GET_TIME] = function (data) {

}

player.methods[METHODS.SET_TIME] = function (data) {

}

player.methods[METHODS.GET_LENGTH] = function (data) {
  let safeguard = "\r\n"

  let returnedResult = false
  let returnedData = data

  let pos = data.indexOf(safeguard)
  if (pos > -1) {
    let length = data.substr(0, pos)
    player.context.length = +length

    returnedResult = true
    returnedData = data.substr(pos + safeguard.length)

    console.log('Media length: ' + player.context.length)
  }

  return {result: returnedResult, data: returnedData}
}

player.methods[METHODS.GET_VOLUME] = function (data) {

}

player.methods[METHODS.SET_VOLUME] = function (data) {

}

player.methods[METHODS.VOLUME_UP] = function (data) {

}

player.methods[METHODS.VOLUME_DOWN] = function (data) {

}

/*
setTimeout(() => vlc.stdin.write('get_title\r\n'), 5000)
setTimeout(() => vlc.stdin.write('get_time\r\n'), 5000)
setTimeout(() => vlc.stdin.write('get_length\r\n'), 5000)
setTimeout(() => vlc.stdin.write('volume 150\r\n'), 5000)
setTimeout(() => vlc.stdin.write('vtrack\r\n'), 5000)
setTimeout(() => vlc.stdin.write('atrack\r\n'), 5000)
setTimeout(() => vlc.stdin.write('strack\r\n'), 5000)




function parse_data(data) {
  let parsed_result = [ [] ]
  let i = 0

  for (let c of data) {
    console.log(c+' : '+String.fromCharCode(c))

    if (c === ">".charCodeAt(0)) {
      i++
      parsed_result[i] = []
      continue
    }
    parsed_result[i].push(c)
  }

  for (let i of parsed_result) {
    console.log('***')
    i.map((c) => console.log(String.fromCharCode(c)))
    console.log('***')
  }
}

*/

module.exports = player
