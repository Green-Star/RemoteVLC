const child_process = require('child_process')

const player = {}

player.tasks = []
player.methods = []
player.vlcProcess = {}

function handleServerFeedback(tasks, data) {
  console.log('handleServerFeedback')
  console.log('Tasks: ' + JSON.stringify(tasks))
  console.log('Data: ' + JSON.stringify(data))

  let task
  
  while ((task = tasks.shift()) !== undefined) {
    player.methods[task](data)
  }
}

function startVLC (filename) {
  /* Spawn VLC process */
  player.vlcProcess = child_process.spawn('vlc',
			      [ filename, '--fullscreen', '--play-and-exit', '-I rc' ])
  
  /* Record player's stdout callback function */
  player.vlcProcess.stdout.on('data', (data) => handleServerFeedback(player.tasks, data))
  
  /* Start media in pause mode */
  player.pause()
  
  /* Get media informations */
  getMediaInformations()
}

function getMediaInformations () {

}

player.start = function (playerName, filename) {
  startVLC(filename)
  console.log('TODO : Start player')
}

player.pause = function () {
  player.tasks.push('pause')
  player.vlcProcess.stdin.write('pause\r\n')
}

player.play = function () {

}

player.getTime = function () {

}

player.setTime = function (time) {

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

player.methods['pause'] = function (data) {

}

player.methods['play'] = function (data) {

}

player.methods['getTime'] = function (data) {

}

player.methods['setTime'] = function (data) {

}

player.methods['getVolume'] = function (data) {

}

player.methods['setVolume'] = function (data) {

}

player.methods['volumeUp'] = function (data) {

}

player.methods['volumeDown'] = function (data) {

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
