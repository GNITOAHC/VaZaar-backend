import express from 'express'
import 'dotenv/config'
import connection from './mysql'
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (_req, res) => {
  connection.query('select * from User', (err, results, fields) => {
    if (err) console.log(err)
    else {
      console.log(results)
      console.log(fields)
      res.send(results)
    }
  })
})

import { auth as authRoute } from './routes'
app.use('/auth', authRoute)

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log('Listening on port 8080')
})
