export const bodyParserJson = async (_request, response, next) => {
  response.setHeader('Content-Type', 'application/json;charset=UTF-8');
  next()
}
