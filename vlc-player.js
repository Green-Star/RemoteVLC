const child_process = require('child_process')

var tasks = []
const player = {}

function startVLC (filename) {
  player = child_process.spawn('vlc',
			      [ filename, '--fullscreen', '--play-and-exit', '-I rc' ])
  
  /* Start media in pause mode */
  player.stdin.write('pause\r\n')

  /* Get media informations */
  getMediaInformations()

  /* Record player's stdout callback function */
  //vlc.stdout.on('data', (data) => parse_data(data))
}

function getMediaInformations () {

}

player.start = function (playerName, filename) {
  console.log('TODO : Start player')
}

player.pause = function () {
}

player.play = function () {

}

player.setVolume = function (volume) {
}

player.volumeUp = function () {

}

player.volumeDown = function () {

}


/*
const /*


const player = {}

player.methods = []
player.methods['foo'] = function () {
  console.log('FOO')
}
player.methods['bar'] = function () {
  console.log('BAR')
}
player.methods['foobar'] = function () {
  console.log('FOOBAR')
}

/*
setTimeout(() => vlc.stdin.write('get_title\r\n'), 5000)
setTimeout(() => vlc.stdin.write('get_time\r\n'), 5000)
setTimeout(() => vlc.stdin.write('get_length\r\n'), 5000)
setTimeout(() => vlc.stdin.write('volume 150\r\n'), 5000)
setTimeout(() => vlc.stdin.write('vtrack\r\n'), 5000)
setTimeout(() => vlc.stdin.write('atrack\r\n'), 5000)
setTimeout(() => vlc.stdin.write('strack\r\n'), 5000)


function handleServerFeedback(tasks, data) {
  for (let task of tasks) {
    player.methods[task](data)
  }
}


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
