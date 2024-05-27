import 'source-map-support/register.js'

import express from "express"
import helmet from "helmet"
import apiRouter from "./api/v1/api.route"
import authRouter from "./auth/v1/auth.route"
import { handleCORS } from "./auth/v1/auth.middleware"
import { configDotenv } from 'dotenv'
import { panicIfEnvVarNotSet } from './util'
import { getMongoClient } from './db'

// load .env into process.env
configDotenv()
panicIfEnvVarNotSet("MONGO_URL")
panicIfEnvVarNotSet("MONGO_DB")
panicIfEnvVarNotSet("SERVER_PORT")


// initiliase shared mongo db instance
export const mongoClient = getMongoClient()

// initialize express
const app = express()

// consume global middlewares
app.use(express.json())
app.use(helmet({
    crossOriginResourcePolicy: false
}))

// register parent route for signup and login
app.use("/auth", authRouter)

// register parent route for all API endpoints
app.use('/api', handleCORS, apiRouter)

// log unhandled exceptions
app.use((err, _req, res, _next) => {
    res.sendStatus(500)
    console.error(err)
})

// start express
const port = process.env.SERVER_PORT!
app.listen(port, () => {
    console.log(`Express server listening on http://localhost:${port}`)
})

