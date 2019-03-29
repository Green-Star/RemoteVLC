import 'mocha'
import { expect } from 'chai'

import request = require('supertest')
import express = require('express')

import { Router } from '../../router'
import { MockPlayer, Context } from '../../player'

import { PlayerData } from '../../../shared'

import { getRequest, putRequest } from '../utils'


describe('Router tests', () => {
  let router: Router
  let player: MockPlayer
  let result: PlayerData
  let app: express.Application

  before(function() {
    app = express()
    player = new MockPlayer('test', new Context())
    player.start()
    router = new Router(player)
    app.use(router.getInternalRouter())

    player.getMediaInformations().then(tabContext => {
      result = tabContext[0]
    })
  })

  it('Should get the media informations', async function () {
    const res = await getRequest(app, '/api/all')

    expect(res.body).to.deep.equal(result)
  })

  it('Should mute the media', async function () {
    const res = await putRequest(app, '/api/volume', 0)

    result.volume = 0
    expect(res.body).to.deep.equal(result)
  })

  it('Should set the volume to 42', async function () {
    const res = await putRequest(app, '/api/volume', 42)

    result.volume = 42
    expect(res.body).to.deep.equal(result)
  })

  it('Should turn down the volume', async function () {
    const res = await putRequest(app, '/api/volume/down')

    result.volume -= 10
    expect(res.body).to.deep.equal(result)
  })

  it('Should turn the volume up', async function () {
    const res = await putRequest(app, '/api/volume/up')

    result.volume += 10
    expect(res.body).to.deep.equal(result)
  })

  it('Should play the media', async function () {
    await makePlayRequest(this)
  })

  it('Should go 30 sec later', async function () {
    const res = await putRequest(app, '/api/time/add', 30)

    result.time += 30
    expect(res.body).to.deep.equal(result)
  })

  it('Should pause the media', async function () {
    await makePauseRequest(this)
  })

  it('Should go back to the beginning', async function () {
    const res = await putRequest(app, '/api/time', 0)

    result.time = 0
    expect(res.body).to.deep.equal(result)
  })

  it("Should do nothing if we can't go backward", async function () {
    const res = await putRequest(app, '/api/time/add', -30)

    expect(res.body).to.deep.equal(result)
  })

  it('Should play the media', async function () {
    await makePlayRequest(this)
  })

  it('Should go 2 minutes later', async function () {
    /* We're making 2 +60 seconds requests instead of one +120
     * because we're not supposed to add more than 60 seconds in one request in the front-end
     */
    await putRequest(app, '/api/time/add', 60)
    const res = await putRequest(app, '/api/time/add', 60)

    result.time += 120
    expect(res.body).to.deep.equal(result)
  })

  it('Should pause the media', async function () {
    await makePauseRequest(this)
  })

  it('Should change the subtitle track', async function () {
    const res = await putRequest(app, '/api/subtitle', 4)

    /* Let's change this by hand in the test */
    result.tracks.subtitle[0].selected = false
    result.tracks.subtitle[2].selected = true
    expect(res.body).to.deep.equal(result)
  })

  it('Should do nothing if the track is already selected', async function () {
    const res = await putRequest(app, '/api/subtitle', 4)
    expect(res.body).to.deep.equal(result)
  })

  it("Should do nothing if the track doesn't exist", async function () {
    const res  = await putRequest(app, '/api/audio', 5)
    expect(res.body).to.deep.equal(result)
  })

  it('Should change the video track', async function () {
    const res  = await putRequest(app, '/api/video', -1)

    /* Let's change this by hand in the test */
    result.tracks.video[1].selected = false
    result.tracks.video[0].selected = true
    expect(res.body).to.deep.equal(result)
  })

  it('Should reset the video track', async function () {
    const res  = await putRequest(app, '/api/video', 0)

    /* Let's change this by hand in the test */
    result.tracks.video[0].selected = false
    result.tracks.video[1].selected = true
    expect(res.body).to.deep.equal(result)
  })

  async function makePlayRequest (test) {
    if (result.isPlaying === true) {
        test.skip()
        return
    }

    const res = await putRequest(app, '/api/play')

    result.isPlaying = true
    expect(res.body).to.deep.equal(result)
  }

  async function makePauseRequest (test) {
    if (result.isPlaying === false) {
        test.skip()
        return
    }

    const res = await putRequest(app, '/api/pause')

    result.isPlaying = false
    expect(res.body).to.deep.equal(result)
  }

})
