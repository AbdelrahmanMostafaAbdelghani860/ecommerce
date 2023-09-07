import express from 'express'
import bootstrap from './src/index.router.js'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const port = 5000
bootstrap(app,express)

// app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))