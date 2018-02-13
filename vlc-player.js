const child_process = require('child_process')

const player = {}

const METHODS = {
  INIT: 'init',
  PAUSE: 'pause',
  SET_TIME: 'setTime',
  GET_TIME: 'getTime',
  GET_TITLE: 'getTitle',
  GET_LENGTH: 'getLength',
  SET_VOLUME: 'setVolume',
  GET_VOLUME: 'getVolume',
  MODIFY_VOLUME: 'modifyVolume',
  SET_VIDEO_TRACK: 'setVideoTrack',
  GET_VIDEO_TRACKS: 'getVideoTracks',
  SET_AUDIO_TRACK: 'setAudioTrack',
  GET_AUDIO_TRACKS: 'getAudioTracks',
  SET_SUBTITLE_TRACK: 'setSubtitleTrack',
  GET_SUBTITLE_TRACKS: 'getSubtitleTracks'
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
    buffer += c
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

function parseTracks (data) {
  let parsedTracks = []
  let result = false
  let regexp = new RegExp(/(\+-{4}\[ (spu|audio|video)-es \]\r\n)/)
  let matchedData = data.match(regexp)

  if (!matchedData || !matchedData[1] || !matchedData[2]) return { returnedResult: false, remainingData: data, tracks: parsedTracks }

  let safeguard = '+----[ end of ' + matchedData[2] + '-es ]\r\n'
  let pos = data.indexOf(safeguard)
  if (pos === -1) return { returnedResult: false, remainingData: data, tracks: parsedTracks }

  let tracksData = data.substr(matchedData[1].length, pos - matchedData[1].length)
  let remainingData = data.substr(pos + safeguard.length)
  result = true

  let subRegex = new RegExp(/\|\s(-?\d+)\s-(?:\s(.*)\s-)?\s(?:\[(.+)\]|([^*\r\n]+))(?:\s(\*?))?\r\n/, 'g')
  let tracks
  while (tracks = subRegex.exec(tracksData)) {
    let trackInfo = {}
    trackInfo.id = +tracks[1]
    trackInfo.title = tracks[2]
    trackInfo.language = (tracks[3]) ? tracks[3] : tracks[4]
    trackInfo.selected = (tracks[5]) ? true : false

    console.log(trackInfo)

    parsedTracks.push(trackInfo)
  }

  return { returnedResult: result, remainingData: remainingData, tracks: parsedTracks }
}

function checkNewTrackId (tracks, trackId) {
  return tracks.findIndex(track => track.id === trackId)
}

function updateTrack (tracks, newTrackIndex) {
  let oldTrackIndex = tracks.findIndex(track => track.selected === true)
  if (oldTrackIndex === -1) return

  tracks[oldTrackIndex].selected = false
  tracks[newTrackIndex].selected = true
}

function startVLC (filename) {
  /* Spawn VLC process */
  player.vlcProcess = child_process.spawn('vlc',
			      [ filename, '--fullscreen', '--play-and-exit', '-I rc' ])
  
  /* Record player's stdout callback function */
  player.vlcProcess.stdout.setEncoding('utf8')
  player.vlcProcess.stdout.on('data', (data) => handleServerFeedback(player.tasks, data))

  player.tasks.push(METHODS.INIT)
  
  /* Start media in pause mode */
  setTimeout(player.pause, 500)
  
  /* Get media informations */
  setTimeout(getMediaInformations, 1000)
}

function getMediaInformations () {
  player.getTitle()
  player.getLength()
  player.getTime()
  player.getVolume()
  player.getVideoTracks()
  player.getAudioTracks()
  player.getSubtitleTracks()
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
  player.pause()
}

player.setTime = function (time) {
  player.tasks.push(METHODS.SET_TIME)
  player.vlcProcess.stdin.write('seek ' + time + '\r\n')
  player.context.time = time
}

player.getTime = function () {
  player.tasks.push(METHODS.GET_TIME)
  player.vlcProcess.stdin.write('get_time\r\n')
}

player.getTitle = function () {
  player.tasks.push(METHODS.GET_TITLE)
  player.vlcProcess.stdin.write('get_title\r\n')
}

player.getLength = function () {
  player.tasks.push(METHODS.GET_LENGTH)
  player.vlcProcess.stdin.write('get_length\r\n')
}

player.setVolume = function (volume) {
  player.tasks.push(METHODS.SET_VOLUME)
  player.vlcProcess.stdin.write('volume ' + volume + '\r\n')
  player.context.volume = volume
}

player.getVolume = function () {
  player.tasks.push(METHODS.GET_VOLUME)
  player.vlcProcess.stdin.write('volume\r\n')
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

player.setVideoTrack = function (trackId) {
  let newTrackIndex = checkNewTrackId(player.context.tracks.video, trackId)
  if (newTrackIndex === -1) return

  player.tasks.push(METHODS.SET_VIDEO_TRACK)
  player.vlcProcess.stdin.write('vtrack ' + trackId + '\r\n')
  updateTrack(player.context.tracks.video, newTrackIndex)
}

player.getVideoTracks = function () {
  player.tasks.push(METHODS.GET_VIDEO_TRACKS)
  player.vlcProcess.stdin.write('vtrack\r\n')
}

player.setAudioTrack = function (trackId) {
  let newTrackIndex = checkNewTrackId(player.context.tracks.audio, trackId)
  if (newTrackIndex === -1) return

  player.tasks.push(METHODS.SET_AUDIO_TRACK)
  player.vlcProcess.stdin.write('atrack ' + trackId + '\r\n')
  updateTrack(player.context.tracks.audio, newTrackIndex)
}

player.getAudioTracks = function () {
  player.tasks.push(METHODS.GET_AUDIO_TRACKS)
  player.vlcProcess.stdin.write('atrack\r\n')
}

player.setSubtitleTrack = function (trackId) {
  /* If the new trackId is not valid, stop here */
  let newTrackIndex = checkNewTrackId(player.context.tracks.subtitle, trackId)
  if (newTrackIndex === -1) return

  player.tasks.push(METHODS.SET_SUBTITLE_TRACK)
  player.vlcProcess.stdin.write('strack ' + trackId + '\r\n')
  updateTrack(player.context.tracks.subtitle, newTrackIndex)
}

player.getSubtitleTracks = function () {
  player.tasks.push(METHODS.GET_SUBTITLE_TRACKS)
  player.vlcProcess.stdin.write('strack\r\n')
}

/*** --------------------------------------------------- ***

                   INTERNAL METHODS

*** --------------------------------------------------- ***/
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

player.methods[METHODS.GET_TITLE] = function (data) {
  let safeguard = "\r\n"

  let returnedResult = false
  let returndData = data

  let pos = data.indexOf(safeguard)
  if (pos > -1) {
    player.context.title = data.substr(0, pos)

    returnedResult = true
    returnedData = data.substr(pos + safeguard.length)

    console.log('Title: ' + player.context.title)
  }

  return { result: returnedResult, data: returnedData }
}

player.methods[METHODS.SET_TIME] = function (data) {
  console.log('Time: ' + player.context.time)
  return { result: true, data: data }
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

  return { result: returnedResult, data: returnedData }
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

  return { result: returnedResult, data: returnedData }
}

player.methods[METHODS.SET_VOLUME] = function (data) {
  console.log('Set Volume: ' + player.context.volume)
  return { result: true, data: data }
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

    return { result: returnedResult, data: returnedData }
  }
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

  return { result: returnedResult, data: returnedData }
}

player.methods[METHODS.SET_VIDEO_TRACK] = function (data) {
  console.log('Set Video track: ' + JSON.stringify(player.context.tracks.video))
  return { result: true, data: data }
}

player.methods[METHODS.GET_VIDEO_TRACKS] = function (data) {
  let result = parseTracks(data)

  player.context.tracks.video = result.tracks

  console.log('Video tracks: ' + JSON.stringify(player.context.tracks.video))

  return { result: result.returnedResult, data: result.remainingData }
}

player.methods[METHODS.SET_AUDIO_TRACK] = function (data) {
  console.log('Set Audio track: ' + JSON.stringify(player.context.tracks.audio))
  return { result: true, data: data }
}

player.methods[METHODS.GET_AUDIO_TRACKS] = function (data) {
  let result = parseTracks(data)

  player.context.tracks.audio = result.tracks

  console.log('Audio tracks: ' + JSON.stringify(player.context.tracks.audio))

  return { result: result.returnedResult, data: result.remainingData }
}

player.methods[METHODS.SET_SUBTITLE_TRACK] = function (data) {
  console.log('Set Subtitle track: ' + JSON.stringify(player.context.tracks.subtitle))
  return { result: true, data: data }
}

player.methods[METHODS.GET_SUBTITLE_TRACKS] = function (data) {
  let result = parseTracks(data)

  player.context.tracks.subtitle = result.tracks

  console.log('Subtitles tracks: ' + JSON.stringify(player.context.tracks.subtitle))

  return { result: result.returnedResult, data: result.remainingData }
}

module.exports = player
