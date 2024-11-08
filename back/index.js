import cors from 'cors'
import express, { json } from 'express'
import { routes } from './routes/routes.js'
const app = express()

app.use(json())
app.use(cors())
app.use(routes)

app.listen(3000, () => console.log("Server running on 3000"))


// const data = Promise()

