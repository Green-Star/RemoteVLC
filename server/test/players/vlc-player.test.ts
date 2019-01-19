import 'mocha'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { Duplex } from 'stream'
import * as child_process from 'child_process'

import { Context, Player, VLCPlayer } from '../../player'

import { Track } from '../../../shared'

import { delay } from '../utils'

const Util = require('util')

describe('VLC player tests', () => {
  let vlcPlayer: Player
  let fakeProcess
  let expectedContext: Context

  before(() => {
    fakeProcess = {
      stdin: new Duplex({
        read(size?) {},
        write(chunk, encoding?, callback?) { console.log(`STDIN : Received: ${chunk}`); callback() }
      }),
      stdout: new Duplex({
        read(size?) {},
        write(chunk, encoding?, callback?) {}
      })
    }
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('Player tests', () => {

    it('Should test the VLC player', async function () {
      this.timeout(5000)

      let fake = sinon.fake.returns(fakeProcess)

      sinon.replace(child_process, 'spawn', fake)

      expectedContext = new Context()

      vlcPlayer = new VLCPlayer('test', fake, new Context(), [], '')
      vlcPlayer.start()

      /* Init */
      fakeProcess.stdout.push("VLC media player")
      fakeProcess.stdout.push(" 3.0.4 ")
      fakeProcess.stdout.push("FAKE VLC\r\n")
      fakeProcess.stdout.push("Command Line Interface initialized. Type `help' for help.\r\n")
      await delay(1000)

      /* Pause mode */
      expectedContext.setPlaying(true)
      expectedContext.stopPlaying()
      fakeProcess.stdout.push("> ")
      await delay(1000)

      /* Title */
      expectedContext.setTitle('My awesome movie')
      fakeProcess.stdout.push(`${expectedContext.getTitle()}\r\n`)
      /* Length */
      expectedContext.setLength(42)
      fakeProcess.stdout.push(`${expectedContext.getLength()}\r\n`)
      /* Time */
      expectedContext.setTime(0)
      fakeProcess.stdout.push(`${expectedContext.getTime()}\r\n`)
      /* Volume */
      expectedContext.setVolume(100)
      fakeProcess.stdout.push(`${expectedContext.getVolume()}\r\n`)
      /* Video tracks */
      expectedContext.setVideoTracks([])
      fakeProcess.stdout.push("+----[ video-es ]\r\n")
      fakeProcess.stdout.push("+----[ end of video-es ]\r\n")
      /* Audio tracks */
      expectedContext.setAudioTracks([])
      fakeProcess.stdout.push("+----[ audio-es ]\r\n")
      fakeProcess.stdout.push("+----[ end of audio-es ]\r\n")
      /* Subtitle tracks */
      expectedContext.setSubtitleTracks([])
      fakeProcess.stdout.push("+----[ spu-es ]\r\n")
      fakeProcess.stdout.push("+----[ end of spu-es ]\r\n")
      await delay(1000)
    })

    it ('Should set the player in play mode', async function () {
      let promise = vlcPlayer.play()
      fakeProcess.stdout.push("> ")
      let result = await promise

      expectedContext.startPlaying()
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should set the player in pause mode', async function () {
      let promise = vlcPlayer.pause()
      fakeProcess.stdout.push("> ")
      let result = await promise

      expectedContext.stopPlaying()
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ("Should get the media's title", async function () {
      let promise = vlcPlayer.getTitle()
      fakeProcess.stdout.push("Testing VLC player ...\r\n> ")
      let result = await promise

      expectedContext.setTitle('Testing VLC player ...')
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ("Should get the media's length", async function () {
      let promise = vlcPlayer.getLength()
      fakeProcess.stdout.push("3293\r\n")
      let result = await promise

      expectedContext.setLength(3293)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should update the volume', async function () {
      let promise = vlcPlayer.getVolume()
      fakeProcess.stdout.push("130\r\n")
      let result = await promise

      expectedContext.setVolume(130)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should update the volume, with another syntax', async function () {
      let promise = vlcPlayer.getVolume()
      fakeProcess.stdout.push("272.0\r\n")
      let result = await promise

      expectedContext.setVolume(272)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should update the volume, with ArchLinux syntax', async function () {
      let promise = vlcPlayer.getVolume()
      fakeProcess.stdout.push("320,0\r\n")
      let result = await promise

      expectedContext.setVolume(320)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should set the volume', async function () {
      let promise = vlcPlayer.setVolume(80)
      fakeProcess.stdout.push("> ")
      let result = await promise

      expectedContext.setVolume(80)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should increase the volume', async function () {
      let promise = vlcPlayer.volumeUp()
      fakeProcess.stdout.push("( audio volume: 90 )\r\n")
      let result = await promise

      expectedContext.setVolume(90)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should increase the volume, with another syntax', async function () {
      let promise = vlcPlayer.volumeUp()
      fakeProcess.stdout.push("( audio volume: 102.0 )\r\n")
      let result = await promise

      expectedContext.setVolume(102)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should increase the volume, with ArchLinux syntax', async function () {
      let promise = vlcPlayer.volumeUp()
      fakeProcess.stdout.push("( audio volume: 115,0 )\r\n")
      let result = await promise

      expectedContext.setVolume(115)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should decrease the volume', async function () {
      let promise = vlcPlayer.volumeDown()
      fakeProcess.stdout.push("( audio volume: 70 )\r\n")
      let result = await promise

      expectedContext.setVolume(70)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should decrease the volume, with another syntax', async function () {
      let promise = vlcPlayer.volumeDown()
      fakeProcess.stdout.push("( audio volume: 51.0 )\r\n")
      let result = await promise

      expectedContext.setVolume(51)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should decrease the volume, with ArchLinux syntax', async function () {
      let promise = vlcPlayer.volumeDown()
      fakeProcess.stdout.push("( audio volume: 38,0 )\r\n")
      let result = await promise

      expectedContext.setVolume(38)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should mute the media', async function () {
      let promise = vlcPlayer.mute()
      fakeProcess.stdout.push("> ")
      let result = await promise

      expectedContext.setVolume(0)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should get the current time', async function () {
      let promise = vlcPlayer.getTime()
      fakeProcess.stdout.push("10\r\n> ")
      let result = await promise

      expectedContext.setTime(10)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should set the current time', async function () {
      let promise = vlcPlayer.setTime(45)
      fakeProcess.stdout.push("> ")
      let result = await promise

      expectedContext.setTime(45)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should go forward', async function () {
      let promise = vlcPlayer.addTime(10)
      fakeProcess.stdout.push("> ")
      let result = await promise

      expectedContext.setTime(55)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should go backward', async function () {
      let promise = vlcPlayer.addTime(-15)
      fakeProcess.stdout.push("> ")
      let result = await promise

      expectedContext.setTime(40)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ("Should not set the time before the media's start", async function () {
      let promise = vlcPlayer.setTime(-5)
      fakeProcess.stdout.push("> ")
      let result = await promise

      expectedContext.setTime(0)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ("Should not set the time beyond the media's length", async function () {
      let promise = vlcPlayer.setTime(expectedContext.getLength() + 6)
      fakeProcess.stdout.push("> ")
      let result = await promise

      expectedContext.setTime(expectedContext.getLength())
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ("Should not go before the media's start", async function () {
      let timePromise = vlcPlayer.setTime(3)
      fakeProcess.stdout.push("> ")
      await timePromise
      expectedContext.setTime(3)

      let testPromise = vlcPlayer.addTime(-10)
      fakeProcess.stdout.push("> ")
      let result = await testPromise

      /* The time should be set at 0 since it can't go in negative */
      expectedContext.setTime(0)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ("Should not go beyond the media's length", async function () {
      let timePromise = vlcPlayer.setTime(expectedContext.getLength() - 6)
      fakeProcess.stdout.push("> ")
      await timePromise
      expectedContext.setTime(expectedContext.getLength() - 6)

      let testPromise = vlcPlayer.addTime(10)
      fakeProcess.stdout.push("> ")
      let result = await testPromise

      /* The time should be limited to the media's length */
      expectedContext.setTime(expectedContext.getLength())
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should do nothing when the user tries to set the time to the current time', async function () {
      /* Set the media time (and ignore the result since we don't need it) */
      let begin = vlcPlayer.setTime(0)
      fakeProcess.stdout.push("> ")
      await begin
      expectedContext.setTime(0)

      /* This promise should be fulfilled immediately */
      let result = await vlcPlayer.addTime(-10)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })

    it ('Should handle partials reads', async function () {
      this.timeout(5000)

      let videoTrack = [
        { id: -1, title: undefined, language: 'Disable', selected: false },
        { id: 0, title: undefined, language: 'Track 1', selected: true }
      ]
      let audioTrack = [
        { id: -1, title: undefined, language: 'Désactiver', selected: false },
        { id: 1, title: 'E-AC3 5.1 @ 640 Kbps', language: 'Anglais', selected: true },
        { id: 2, title: 'E-AC3 5.1 @ 640 Kbps', language: 'Français', selected: false }
      ]
      let subtitleTrack = [
        { id: -1, title: undefined, language: 'Désactiver', selected: false },
        { id: 3, title: 'Z1 (srt)', language: 'Français', selected: true },
        { id: 4, title: undefined, language: 'Sous-titrage malentendants 1', selected: false },
        { id: 5, title: undefined, language: 'Sous-titrage malentendants 2', selected: false },
        { id: 6, title: undefined, language: 'Sous-titrage malentendants 3', selected: false },
        { id: 7, title: undefined, language: 'Sous-titrage malentendants 4', selected: false }
      ]

      let promiseAll = vlcPlayer.getMediaInformations()

      /* Title */
      fakeProcess.stdout.push(`${expectedContext.getTitle()}\r\n`)
      await delay(300)

      /* Length */
      fakeProcess.stdout.push(`${expectedContext.getLength()}\r\n`)
      await delay(300)

      /* Time */
      fakeProcess.stdout.push(`${expectedContext.getTime()}\r\n`)
      await delay(300)

      /* Volume */
      fakeProcess.stdout.push(`${expectedContext.getVolume()}\r\n`)
      await delay(100)

      /* Video tracks */
      fakeProcess.stdout.push("+----[ video-es ]\r\n")
      await delay(200)
      fakeProcess.stdout.push("| -1 - Disable\r\n")
      await delay(200)
      fakeProcess.stdout.push("| 0 - Track 1 *\r\n")
      await delay(200)
      fakeProcess.stdout.push("+----[ end of video-es ]\r\n")
      await delay(200)

      /* Audio tracks */
      fakeProcess.stdout.push("+----[ audio-es ]\r\n")
      await delay(200)
      fakeProcess.stdout.push("| -1 - Désactiver\r\n")
      await delay(200)
      fakeProcess.stdout.push("| 1 - E-AC3 5.1 @ 640 Kbps - [Anglais] *\r\n")
      await delay(200)
      fakeProcess.stdout.push("| 2 - E-AC3 5.1 @ 640 Kbps - [Français]\r\n")
      await delay(200)
      fakeProcess.stdout.push("+----[ end of audio-es ]\r\n")
      await delay(200)

      /* Subtitle tracks */
      fakeProcess.stdout.push("+----[ spu-es ]\r\n")
      await delay(200)
      fakeProcess.stdout.push("| -1 - Désactiver\r\n")
      await delay(200)
      fakeProcess.stdout.push("| 3 - Z1 (srt) - [Français] *\r\n")
      await delay(200)
      fakeProcess.stdout.push("| 4 - Sous-titrage malentendants 1\r\n")
      await delay(200)
      fakeProcess.stdout.push("| 5 - Sous-titrage malentendants 2\r\n")
      await delay(200)
      fakeProcess.stdout.push("| 6 - Sous-titrage malentendants 3\r\n")
      await delay(200)
      fakeProcess.stdout.push("| 7 - Sous-titrage malentendants 4\r\n")
      await delay(200)
      fakeProcess.stdout.push("+----[ end of spu-es ]\r\n")
      await delay(300)
      fakeProcess.stdout.push("> ")

      let resultPromiseAll = await promiseAll
      let result = resultPromiseAll[6]

      expectedContext.setVideoTracks(videoTrack)
      expectedContext.setAudioTracks(audioTrack)
      expectedContext.setSubtitleTracks(subtitleTrack)
      expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
    })
  })

  describe('Track tests', () => {
    let emptyTracks: Track[]
    let defaultTracks: Track[]
    let testTracks1: Track[]
    let testTracks2: Track[]
    let testTracks3: Track[]
    let testTracks4: Track[]
    let testTracks5: Track[]
    let testTracks6: Track[]
    let testTracks7: Track[]
    let testTracks8: Track[]

    beforeEach (() => {
      emptyTracks = []
      defaultTracks = [
        { id: -1, title: undefined, language: 'Disable', selected: false },
        { id: 0, title: undefined, language: 'Track 1', selected: true }
      ]
      testTracks1 = [
        { id: -1, title: undefined, language: 'Désactiver', selected: false },
        { id: 1, title: 'E-AC3 5.1 @ 640 Kbps', language: 'Anglais', selected: true },
        { id: 2, title: 'E-AC3 5.1 @ 640 Kbps', language: 'Français', selected: false }
      ]
      testTracks2 = [
        { id: -1, title: undefined, language: 'Désactiver', selected: false },
        { id: 3, title: 'Z1 (srt)', language: 'Français', selected: true },
        { id: 4, title: undefined, language: 'Sous-titrage malentendants 1', selected: false },
        { id: 5, title: undefined, language: 'Sous-titrage malentendants 2', selected: false },
        { id: 6, title: undefined, language: 'Sous-titrage malentendants 3', selected: false },
        { id: 7, title: undefined, language: 'Sous-titrage malentendants 4', selected: false }
      ]
      testTracks3 = [
        { id: -1, title: undefined, language: 'Désactiver', selected: false },
        { id: 0, title: 'Piste 1', language: 'Anglais', selected: true }
      ]
      testTracks4 = [
        { id: -1, title: undefined, language: 'Désactiver', selected: false },
        { id: 1, title: 'FR', language: 'Français', selected: true },
        { id: 2, title: 'EN', language: 'Anglais', selected: false }
      ]
      testTracks5 = [
        { id: -1, title: undefined, language: 'Désactiver', selected: true },
        { id: 3, title: 'FRF', language: 'Français', selected: false },
        { id: 4, title: 'FR', language: 'Français', selected: false },
        { id: 5, title: 'EN', language: 'Anglais', selected: false }
      ]
      testTracks6 = [
        { id: -1, title: undefined, language: 'Disable', selected: false },
        { id: 0, title: undefined, language: 'My Awesome Movie (2017) VFF-ENG AC3 BluRay 1080p x264.GHT', selected: true }
      ]
      testTracks7 = [
        { id: -1, title: undefined, language: 'Désactiver', selected: false },
        { id: 1, title: 'VFF AC3 5.1 @448kbps', language: 'Français', selected: true },
        { id: 2, title: 'ENG AC3 5.1 @448kbps', language: 'Anglais', selected: false }
      ]
      testTracks8 = [
        { id: -1, title: undefined, language: 'Désactiver', selected: false },
        { id: 3, title: 'FR Forced', language: 'Français', selected: false },
        { id: 4, title: 'FR Forced Colored', language: 'Français', selected: true },
        { id: 5, title: 'FR Full', language: 'Français', selected: false },
        { id: 6, title: 'FR Full SDH', language: 'Français', selected: false },
        { id: 7, title: 'ENG Full', language: 'Anglais', selected: false },
        { id: 8, title: 'ENG Full SDH', language: 'Anglais', selected: false }
      ]
    })

    describe('Video track tests', () => {

      it ('Should get empty video tracks', async function () {
        let promise = vlcPlayer.getVideoTracks()
        fakeProcess.stdout.push("+----[ video-es ]\r\n")
        fakeProcess.stdout.push("+----[ end of video-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setVideoTracks(emptyTracks)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get default video tracks', async function () {
        let promise = vlcPlayer.getVideoTracks()
        fakeProcess.stdout.push("+----[ video-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Disable\r\n")
        fakeProcess.stdout.push("| 0 - Track 1 *\r\n")
        fakeProcess.stdout.push("+----[ end of video-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setVideoTracks(defaultTracks)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex video tracks #1', async function () {
        let promise = vlcPlayer.getVideoTracks()
        fakeProcess.stdout.push("+----[ video-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 1 - E-AC3 5.1 @ 640 Kbps - [Anglais] *\r\n")
        fakeProcess.stdout.push("| 2 - E-AC3 5.1 @ 640 Kbps - [Français]\r\n")
        fakeProcess.stdout.push("+----[ end of video-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setVideoTracks(testTracks1)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex video tracks #2', async function () {
        let promise = vlcPlayer.getVideoTracks()
        fakeProcess.stdout.push("+----[ video-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 3 - Z1 (srt) - [Français] *\r\n")
        fakeProcess.stdout.push("| 4 - Sous-titrage malentendants 1\r\n")
        fakeProcess.stdout.push("| 5 - Sous-titrage malentendants 2\r\n")
        fakeProcess.stdout.push("| 6 - Sous-titrage malentendants 3\r\n")
        fakeProcess.stdout.push("| 7 - Sous-titrage malentendants 4\r\n")
        fakeProcess.stdout.push("+----[ end of video-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setVideoTracks(testTracks2)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex video tracks #3', async function () {
        let promise = vlcPlayer.getVideoTracks()
        fakeProcess.stdout.push("+----[ video-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 0 - Piste 1 - [Anglais] *\r\n")
        fakeProcess.stdout.push("+----[ end of video-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setVideoTracks(testTracks3)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex video tracks #4', async function () {
        let promise = vlcPlayer.getVideoTracks()
        fakeProcess.stdout.push("+----[ video-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 1 - FR - [Français] *\r\n")
        fakeProcess.stdout.push("| 2 - EN - [Anglais]\r\n")
        fakeProcess.stdout.push("+----[ end of video-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setVideoTracks(testTracks4)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex video tracks #5', async function () {
        let promise = vlcPlayer.getVideoTracks()
        fakeProcess.stdout.push("+----[ video-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver *\r\n")
        fakeProcess.stdout.push("| 3 - FRF - [Français]\r\n")
        fakeProcess.stdout.push("| 4 - FR - [Français]\r\n")
        fakeProcess.stdout.push("| 5 - EN - [Anglais]\r\n")
        fakeProcess.stdout.push("+----[ end of video-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setVideoTracks(testTracks5)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex video tracks #6', async function () {
        let promise = vlcPlayer.getVideoTracks()
        fakeProcess.stdout.push("+----[ video-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Disable\r\n")
        fakeProcess.stdout.push("| 0 - My Awesome Movie (2017) VFF-ENG AC3 BluRay 1080p x264.GHT *\r\n")
        fakeProcess.stdout.push("+----[ end of video-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setVideoTracks(testTracks6)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex video tracks #7', async function () {
        let promise = vlcPlayer.getVideoTracks()
        fakeProcess.stdout.push("+----[ video-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 1 - VFF AC3 5.1 @448kbps - [Français] *\r\n")
        fakeProcess.stdout.push("| 2 - ENG AC3 5.1 @448kbps - [Anglais]\r\n")
        fakeProcess.stdout.push("+----[ end of video-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setVideoTracks(testTracks7)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex video tracks #8', async function () {
        let promise = vlcPlayer.getVideoTracks()
        fakeProcess.stdout.push("+----[ video-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 3 - FR Forced - [Français]\r\n")
        fakeProcess.stdout.push("| 4 - FR Forced Colored - [Français] *\r\n")
        fakeProcess.stdout.push("| 5 - FR Full - [Français]\r\n")
        fakeProcess.stdout.push("| 6 - FR Full SDH - [Français]\r\n")
        fakeProcess.stdout.push("| 7 - ENG Full - [Anglais]\r\n")
        fakeProcess.stdout.push("| 8 - ENG Full SDH - [Anglais]\r\n")
        fakeProcess.stdout.push("+----[ end of video-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setVideoTracks(testTracks8)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should update the selected video tracks', async function () {
        let promise = vlcPlayer.setVideoTrack(-1)
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setSelectedVideoTrack(-1)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it.skip ('Should do nothing if the selected video track does not exist', async function () {
        /* This promise should be fulfilled immediately */
        let result = await vlcPlayer.setVideoTrack(-5)

        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })
    })

    describe('Audio track tests', () => {

      it ('Should get empty audio tracks', async function () {
        let promise = vlcPlayer.getAudioTracks()
        fakeProcess.stdout.push("+----[ audio-es ]\r\n")
        fakeProcess.stdout.push("+----[ end of audio-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setAudioTracks(emptyTracks)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get default audio tracks', async function () {
        let promise = vlcPlayer.getAudioTracks()
        fakeProcess.stdout.push("+----[ audio-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Disable\r\n")
        fakeProcess.stdout.push("| 0 - Track 1 *\r\n")
        fakeProcess.stdout.push("+----[ end of audio-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setAudioTracks(defaultTracks)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex audio tracks #1', async function () {
        let promise = vlcPlayer.getAudioTracks()
        fakeProcess.stdout.push("+----[ audio-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 1 - E-AC3 5.1 @ 640 Kbps - [Anglais] *\r\n")
        fakeProcess.stdout.push("| 2 - E-AC3 5.1 @ 640 Kbps - [Français]\r\n")
        fakeProcess.stdout.push("+----[ end of audio-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setAudioTracks(testTracks1)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex audio tracks #2', async function () {
        let promise = vlcPlayer.getAudioTracks()
        fakeProcess.stdout.push("+----[ audio-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 3 - Z1 (srt) - [Français] *\r\n")
        fakeProcess.stdout.push("| 4 - Sous-titrage malentendants 1\r\n")
        fakeProcess.stdout.push("| 5 - Sous-titrage malentendants 2\r\n")
        fakeProcess.stdout.push("| 6 - Sous-titrage malentendants 3\r\n")
        fakeProcess.stdout.push("| 7 - Sous-titrage malentendants 4\r\n")
        fakeProcess.stdout.push("+----[ end of audio-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setAudioTracks(testTracks2)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex audio tracks #3', async function () {
        let promise = vlcPlayer.getAudioTracks()
        fakeProcess.stdout.push("+----[ audio-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 0 - Piste 1 - [Anglais] *\r\n")
        fakeProcess.stdout.push("+----[ end of audio-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setAudioTracks(testTracks3)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex audio tracks #4', async function () {
        let promise = vlcPlayer.getAudioTracks()
        fakeProcess.stdout.push("+----[ audio-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 1 - FR - [Français] *\r\n")
        fakeProcess.stdout.push("| 2 - EN - [Anglais]\r\n")
        fakeProcess.stdout.push("+----[ end of audio-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setAudioTracks(testTracks4)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex audio tracks #5', async function () {
        let promise = vlcPlayer.getAudioTracks()
        fakeProcess.stdout.push("+----[ audio-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver *\r\n")
        fakeProcess.stdout.push("| 3 - FRF - [Français]\r\n")
        fakeProcess.stdout.push("| 4 - FR - [Français]\r\n")
        fakeProcess.stdout.push("| 5 - EN - [Anglais]\r\n")
        fakeProcess.stdout.push("+----[ end of audio-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setAudioTracks(testTracks5)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex audio tracks #6', async function () {
        let promise = vlcPlayer.getAudioTracks()
        fakeProcess.stdout.push("+----[ audio-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Disable\r\n")
        fakeProcess.stdout.push("| 0 - My Awesome Movie (2017) VFF-ENG AC3 BluRay 1080p x264.GHT *\r\n")
        fakeProcess.stdout.push("+----[ end of audio-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setAudioTracks(testTracks6)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex audio tracks #7', async function () {
        let promise = vlcPlayer.getAudioTracks()
        fakeProcess.stdout.push("+----[ audio-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 1 - VFF AC3 5.1 @448kbps - [Français] *\r\n")
        fakeProcess.stdout.push("| 2 - ENG AC3 5.1 @448kbps - [Anglais]\r\n")
        fakeProcess.stdout.push("+----[ end of audio-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setAudioTracks(testTracks7)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex audio tracks #8', async function () {
        let promise = vlcPlayer.getAudioTracks()
        fakeProcess.stdout.push("+----[ audio-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 3 - FR Forced - [Français]\r\n")
        fakeProcess.stdout.push("| 4 - FR Forced Colored - [Français] *\r\n")
        fakeProcess.stdout.push("| 5 - FR Full - [Français]\r\n")
        fakeProcess.stdout.push("| 6 - FR Full SDH - [Français]\r\n")
        fakeProcess.stdout.push("| 7 - ENG Full - [Anglais]\r\n")
        fakeProcess.stdout.push("| 8 - ENG Full SDH - [Anglais]\r\n")
        fakeProcess.stdout.push("+----[ end of audio-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setAudioTracks(testTracks8)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should update the selected audio tracks', async function () {
        let promise = vlcPlayer.setAudioTrack(-1)
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setSelectedAudioTrack(-1)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it.skip ('Should do nothing if the selected audio track does not exist', async function () {
        /* This promise should be fulfilled immediately */
        let result = await vlcPlayer.setAudioTrack(-5)

        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })
    })

    describe('Subtitle track tests', () => {

      it ('Should get empty subtitle tracks', async function () {
        let promise = vlcPlayer.getSubtitleTracks()
        fakeProcess.stdout.push("+----[ spu-es ]\r\n")
        fakeProcess.stdout.push("+----[ end of spu-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setSubtitleTracks(emptyTracks)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get default subtitle tracks', async function () {
        let promise = vlcPlayer.getSubtitleTracks()
        fakeProcess.stdout.push("+----[ spu-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Disable\r\n")
        fakeProcess.stdout.push("| 0 - Track 1 *\r\n")
        fakeProcess.stdout.push("+----[ end of spu-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setSubtitleTracks(defaultTracks)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex subtitle tracks #1', async function () {
        let promise = vlcPlayer.getSubtitleTracks()
        fakeProcess.stdout.push("+----[ spu-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 1 - E-AC3 5.1 @ 640 Kbps - [Anglais] *\r\n")
        fakeProcess.stdout.push("| 2 - E-AC3 5.1 @ 640 Kbps - [Français]\r\n")
        fakeProcess.stdout.push("+----[ end of spu-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setSubtitleTracks(testTracks1)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex subtitle tracks #2', async function () {
        let promise = vlcPlayer.getSubtitleTracks()
        fakeProcess.stdout.push("+----[ spu-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 3 - Z1 (srt) - [Français] *\r\n")
        fakeProcess.stdout.push("| 4 - Sous-titrage malentendants 1\r\n")
        fakeProcess.stdout.push("| 5 - Sous-titrage malentendants 2\r\n")
        fakeProcess.stdout.push("| 6 - Sous-titrage malentendants 3\r\n")
        fakeProcess.stdout.push("| 7 - Sous-titrage malentendants 4\r\n")
        fakeProcess.stdout.push("+----[ end of spu-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setSubtitleTracks(testTracks2)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex subtitle tracks #3', async function () {
        let promise = vlcPlayer.getSubtitleTracks()
        fakeProcess.stdout.push("+----[ spu-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 0 - Piste 1 - [Anglais] *\r\n")
        fakeProcess.stdout.push("+----[ end of spu-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setSubtitleTracks(testTracks3)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex subtitle tracks #4', async function () {
        let promise = vlcPlayer.getSubtitleTracks()
        fakeProcess.stdout.push("+----[ spu-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 1 - FR - [Français] *\r\n")
        fakeProcess.stdout.push("| 2 - EN - [Anglais]\r\n")
        fakeProcess.stdout.push("+----[ end of spu-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setSubtitleTracks(testTracks4)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex subtitle tracks #5', async function () {
        let promise = vlcPlayer.getSubtitleTracks()
        fakeProcess.stdout.push("+----[ spu-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver *\r\n")
        fakeProcess.stdout.push("| 3 - FRF - [Français]\r\n")
        fakeProcess.stdout.push("| 4 - FR - [Français]\r\n")
        fakeProcess.stdout.push("| 5 - EN - [Anglais]\r\n")
        fakeProcess.stdout.push("+----[ end of spu-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setSubtitleTracks(testTracks5)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex subtitle tracks #6', async function () {
        let promise = vlcPlayer.getSubtitleTracks()
        fakeProcess.stdout.push("+----[ spu-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Disable\r\n")
        fakeProcess.stdout.push("| 0 - My Awesome Movie (2017) VFF-ENG AC3 BluRay 1080p x264.GHT *\r\n")
        fakeProcess.stdout.push("+----[ end of spu-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setSubtitleTracks(testTracks6)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex subtitle tracks #7', async function () {
        let promise = vlcPlayer.getSubtitleTracks()
        fakeProcess.stdout.push("+----[ spu-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 1 - VFF AC3 5.1 @448kbps - [Français] *\r\n")
        fakeProcess.stdout.push("| 2 - ENG AC3 5.1 @448kbps - [Anglais]\r\n")
        fakeProcess.stdout.push("+----[ end of spu-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setSubtitleTracks(testTracks7)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should get complex subtitle tracks #8', async function () {
        let promise = vlcPlayer.getSubtitleTracks()
        fakeProcess.stdout.push("+----[ spu-es ]\r\n")
        fakeProcess.stdout.push("| -1 - Désactiver\r\n")
        fakeProcess.stdout.push("| 3 - FR Forced - [Français]\r\n")
        fakeProcess.stdout.push("| 4 - FR Forced Colored - [Français] *\r\n")
        fakeProcess.stdout.push("| 5 - FR Full - [Français]\r\n")
        fakeProcess.stdout.push("| 6 - FR Full SDH - [Français]\r\n")
        fakeProcess.stdout.push("| 7 - ENG Full - [Anglais]\r\n")
        fakeProcess.stdout.push("| 8 - ENG Full SDH - [Anglais]\r\n")
        fakeProcess.stdout.push("+----[ end of spu-es ]\r\n")
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setSubtitleTracks(testTracks8)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it ('Should update the selected subtitle tracks', async function () {
        let promise = vlcPlayer.setSubtitleTrack(-1)
        fakeProcess.stdout.push("> ")
        let result = await promise

        expectedContext.setSelectedSubtitleTrack(-1)
        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })

      it.skip ('Should do nothing if the selected subtitle track does not exist', async function () {
        /* This promise should be fulfilled immediately */
        let result = await vlcPlayer.setSubtitleTrack(-5)

        expect(result).to.deep.equal(expectedContext.toFormattedPlayerData())
      })
    })
  })
})
