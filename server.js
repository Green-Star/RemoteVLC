const child_process = require('child_process')

console.log('Starting Remote control for ' + process.argv[2])

/*** Start player control ***/
console.log('Spawning VLC ...')

const vlc = child_process.spawn('vlc',
				[ process.argv[2], '--fullscreen', '--play-and-exit', '-I rc' ])

/* Start media in pause mode */
vlc.stdin.write('pause\r\n')

/* Get media informations */

/* Record player's stdout callback function */
vlc.stdout.on('data', (data) => {
  console.log('Data coming from VLC : ['+data+']')
})


/*** Start WebUI control ***/
console.log('Spawning web UI')

setTimeout(() => vlc.stdin.write('play\r\n'), 5000)
