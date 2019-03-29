import { delay, resolvedPromise } from '../utils'

import request = require('supertest')
import express = require('express')

function getRequest(url: express.Application | string, route: string, returnCode: number = 200) {
  return request(url)
          .get(route)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(returnCode)
}

function putRequest(url: express.Application | string, route: string, value: any = undefined, returnCode: number = 200) {
  let path = route
  if (value !== undefined) path = route + '/' + value

  let req = request(url)
              .put(path)
              .set('Accept', 'application/json')

  return req.send()
            .expect(returnCode)
}

export {
  delay,
  resolvedPromise,
  getRequest,
  putRequest
}
