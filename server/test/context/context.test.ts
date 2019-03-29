import 'mocha'
import { expect } from 'chai'
import * as sinon from 'sinon'

import express = require('express')

import { delay } from '../utils'
import { Router } from '../../router'
import { Context, MockPlayer } from '../../player'

import { PlayerData, Track } from '../../../shared'

describe('Context tests', function () {
  let context: Context
  let result: PlayerData

  before(function () {
    context = new Context()
  })

  beforeEach(function () {
    result = context.toFormattedPlayerData()
  })

  this.timeout(10000)

  it('Should set the title', () => {
    context.setTitle('Test')
    result.title = 'Test'
    expect(context.toFormattedPlayerData()).to.deep.equal(result)
  })

  it('Should set the playing state', () => {
    context.setPlaying(true)
    result.isPlaying = true
    expect(context.toFormattedPlayerData()).to.deep.equal(result)
  })

  it('Should set the volume', () => {
    context.setVolume(42)
    result.volume = 42
    expect(context.toFormattedPlayerData()).to.deep.equal(result)
  })

  it('Should set the time', () => {
    context.setTime(60)
    result.time = 60
    expect(context.toFormattedPlayerData()).to.deep.equal(result)
  })

  it('Should set the length', () => {
    context.setLength(3600)
    result.length = 3600
    expect(context.toFormattedPlayerData()).to.deep.equal(result)
  })

  it('Should set the video tracks', () => {
    let videoTrack: Track[] = []

    videoTrack.push({ id: -1, language: "None", selected: false })
    videoTrack.push({ id: 0, title: "Track 1", language: "English", selected: true })

    context.setVideoTracks(videoTrack)
    result.tracks.video = videoTrack
    expect(context.toFormattedPlayerData()).to.deep.equal(result)
  })

  it('Should set the audio tracks', () => {
    let audioTrack: Track[] = []

    audioTrack.push({ id: -1, language: "None", selected: false })
    audioTrack.push({ id: 1, title: "VFF - AC3 5.1", language: "Français", selected: true })
    audioTrack.push({ id: 2, title: "VO - AC3 5 .1", language: "English", selected: false })

    context.setAudioTracks(audioTrack)
    result.tracks.audio = audioTrack
    expect(context.toFormattedPlayerData()).to.deep.equal(result)
  })

  it('Should set the subtitles tracks', () => {
    let subtitleTrack: Track[] = []

    subtitleTrack.push({ id: -1, language: "Désactiver", selected: true })
    subtitleTrack.push({ id: 3, title: "FRF", language: "Français", selected: false })
    subtitleTrack.push({ id: 4, title: "FR", language: "Français", selected: false })
    subtitleTrack.push({ id: 5, title: "EN",language: "Anglais", selected: false })

    context.setSubtitleTracks(subtitleTrack)
    result.tracks.subtitle = subtitleTrack
    expect(context.toFormattedPlayerData()).to.deep.equal(result)
  })

  it('Should set the selected video track', () => {
    let returnedValue = context.setSelectedVideoTrack(-1)
    result.tracks.video[1].selected = true
    result.tracks.video[0].selected = false

    expect(returnedValue).to.be.true
    expect(context.toFormattedPlayerData()).to.deep.equal(result)
  })

  it("Should do nothing if the video track doesn't exist", () => {
    let returnedValue = context.setSelectedVideoTrack(12)

    expect(returnedValue).to.be.false
  })

  it('Should set the selected audio track', () => {
    let returnedValue = context.setSelectedAudioTrack(2)
    result.tracks.audio[2].selected = true
    result.tracks.audio[1].selected = false

    expect(returnedValue).to.be.true
    expect(context.toFormattedPlayerData()).to.deep.equal(result)
  })

  it("Should do nothing if the audio track doesn't exist", () => {
    let returnedValue = context.setSelectedAudioTrack(42)

    expect(returnedValue).to.be.false
  })

  it('Should set the selected subtitle track', () => {
    let returnedValue = context.setSelectedSubtitleTrack(5)
    result.tracks.subtitle[3].selected = true
    result.tracks.subtitle[0].selected = false

    expect(returnedValue).to.be.true
    expect(context.toFormattedPlayerData()).to.deep.equal(result)
  })

  it("Should do nothing if the subtitle track doesn't exist", () => {
    let returnedValue = context.setSelectedSubtitleTrack(-2)

    expect(returnedValue).to.be.false
  })

  it('Should update seconds when the timer is active', async function () {
    this.slow(2500)

    let seconds = context.toFormattedPlayerData().time
    context.startTimer()

    await delay(2100)

    context.stopTimer()
    seconds += 2

    expect(context.toFormattedPlayerData().time).to.equal(seconds)
  })

  it('Should start and stop playing', async function () {
    this.slow(5500)

    context.startPlaying()
    result.isPlaying = true

    expect(context.toFormattedPlayerData()).to.deep.equal(result)

    await delay(5100)

    context.stopPlaying()
    result.isPlaying = false
    result.time += 5

    expect(context.toFormattedPlayerData()).to.deep.equal(result)
  })
})
