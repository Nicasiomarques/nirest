import { once } from "node:events";
import http from "node:http";

import { constants } from "./constants.js";

export const nirest = port => {
  const [api, routes, interceptors] = [{}, {}, []]
  const methods = constants.supportedMethods

  methods.forEach(method => {
    routes[method] = {}
    api[method.toLowerCase()] = (path, fn) => routes[method][path] = fn
  })

  api[constants.InterceptorKey] = interceptor => interceptors.push(interceptor)

  const handleBody = async request => JSON.parse(await once(request, 'data'))
  const runInterceptor = (index, request, response) => {
    const interceptor = interceptors[index] 
    if (!interceptor) return
    interceptor(request, response, () => {
      runInterceptor(++index, request, response)
    })
  }

  http.createServer(async (request, response) => {
    runInterceptor(0, request, response)
    request[constants.BodyKey] = await handleBody(request)
    response.status = statusCode => {
      Object.assign(response, { statusCode })
      return {
        json: obj => {
          response.write(JSON.stringify(obj))
          response.end()
        }
      }
    }
    const selectedRoute = routes[request.method][request.url]
    if (!selectedRoute) {
      response.statusCode = 404
      response.write('not found!')
      return response.end()
    }
    return selectedRoute(request, response)
  }).listen(port)
  return api
}
