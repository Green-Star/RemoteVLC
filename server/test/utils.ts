import request = require('supertest')

function getRequest(url, route, returnCode = 200) {
  return request(url)
          .get(route)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(returnCode)
}

function putRequest (options: {
  url: string,
  path: string,
  fields: { [ fieldName: string ]: any },
  statusCodeExpected?: number
}) {
  if (!options.statusCodeExpected) options.statusCodeExpected = 204

  const req = request(options.url)
                .put(options.path)
                .set('Accept', 'application/json')

  return req.send(options.fields)
            .expect(options.statusCodeExpected)
}



export {
  getRequest,
  putRequest
}
