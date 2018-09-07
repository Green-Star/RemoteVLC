import 'mocha'
import { expect } from 'chai'

import request = require('supertest')
import express = require('express')

import { Router } from '../../router'
import { MockPlayer } from '../../player'

import { PlayerData } from '../../../shared'

import { getRequest } from '../utils'


describe('Router tests', () => {
  let router: Router
  let player: MockPlayer
  let result: PlayerData
  let app: express.Application

  before(function() {
    app = express()
    player = new MockPlayer('test')
    player.start()
    router = new Router(player)
    app.use(router.getInternalRouter())

    player.getMediaInformations().then(tabContext => {
      result = tabContext[0]
    })

    app.get('/user', function(req, res) {
      res.status(200).json({ name: 'john'})
    })
  })

  it('Should get the media informations', async function () {
    const res = await getRequest(app, '/api/all')

    expect(res.body).to.deep.equal(result)
  })
})