import { nirest } from './main.js'
import { bodyParserJson } from './bodyParserJson.js'
import { cors } from './cors.js'

const app = nirest(3000)
app.use(bodyParserJson)
app.use(cors)

app.get('/app', (_request, response) => {
  response.status(200).json({ something: 'new' })
})

app.post('/app', (_request, response) => {
  response.status(200).json({ foo: 'bar' })
})
 