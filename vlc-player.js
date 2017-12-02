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
  MODIFY_VOLUME: 'modifyVolume'
}

player.tasks = []
player.data = ''
player.methods = []
player.vlcProcess = {}
player.context = {}

function sanitizeServerFeedback (bufferData) {
  /* Sanitize server feedback */
  /* (remove every '> ') */
  return bufferData.replace(new RegExp(/> /, 'g'), '')
}

function handleServerFeedback (tasksToDo, data) {
  console.log('=== Start handleServerFeedback ===')

  let buffer = ''
  /* Bufferize the data and consume it whenever needed */
  for (let c of data) {
    buffer += String.fromCharCode(c)
  }

  console.log('Original data: [' + buffer + ']')
  let sanitizedData = sanitizeServerFeedback(buffer)
  console.log('Sanitized data: ['+ sanitizedData + ']')
  player.data += sanitizedData

  let pendingTasks = tasksToDo.slice()
  let pendingData = player.data
  console.log('Tasks to do: ' + JSON.stringify(pendingTasks))
  console.log('Data: ' + JSON.stringify(pendingData))

  for (let task of tasksToDo) {
    console.log('Execute: ' + task)

    let end = player.methods[task](pendingData)
    if (end.result === false) break

    /* If the function succeeded we can remove it from the pending tasks */
    pendingTasks.shift()
    /* And it has consume the relevant data, so we remove them too */
    pendingData = end.data
  }

  player.tasks = pendingTasks
  player.data = pendingData

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
  player.getTime()
  player.getVolume()
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
  player.tasks.push(METHODS.GET_TIME)
  player.vlcProcess.stdin.write('get_time\r\n')
}

player.setTime = function (time) {

}

player.getLength = function () {
  player.tasks.push(METHODS.GET_LENGTH)
  player.vlcProcess.stdin.write('get_length\r\n')
}

player.getVolume = function () {
  player.tasks.push(METHODS.GET_VOLUME)
  player.vlcProcess.stdin.write('volume\r\n')
}

player.setVolume = function (volume) {
  player.tasks.push(METHODS.SET_VOLUME)
  player.vlcProcess.stdin.write('volume ' + volume + '\r\n')
  player.context.volume = volume
}

player.volumeUp = function () {
  player.tasks.push(METHODS.MODIFY_VOLUME)
  player.vlcProcess.stdin.write('volup\r\n')
}

player.volumeDown = function () {
  player.tasks.push(METHODS.MODIFY_VOLUME)
  player.vlcProcess.stdin.write('voldown\r\n')
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
  let safeguard = "\r\n"

  let returnedResult = false
  let returnedData = data

  let pos = data.indexOf(safeguard)
  if (pos > -1) {
    let time = data.substr(0, pos)
    player.context.time = +time

    returnedResult = true
    returnedData = data.substr(pos + safeguard.length)

    console.log('Current time: ' + player.context.time)
  }

  return {result: returnedResult, data: returnedData}
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
  let safeguard = "\r\n"

  let returnedResult = false
  let returnedData = data

  let pos = data.indexOf(safeguard)
  if (pos > -1) {
    let volume = data.substr(0, pos)
    player.context.volume = +volume

    returnedResult = true
    returnedData = data.substr(pos + safeguard.length)

    console.log('Volume: ' + player.context.volume)

    return {result: returnedResult, data: returnedData}
  }
}

player.methods[METHODS.SET_VOLUME] = function (data) {
  console.log('Set Volume: ' + player.context.volume)
  return {result: true, data: data}
}

player.methods[METHODS.MODIFY_VOLUME] = function (data) {
  let returnedResult = false
  let returnedData = data

  let regexp = new RegExp(/^\( audio volume: (\d+) \)\r\n/)
  let matching = data.match(regexp)

  if (matching && matching[0] && matching[1]) {
    player.context.volume = +matching[1]

    returnedResult = true
    returnedData = data.substr(matching[0].length)

    console.log('Volume: ' + player.context.volume)
  }

  return {result: returnedResult, data: returnedData}
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
