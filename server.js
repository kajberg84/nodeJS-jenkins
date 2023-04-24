import express from "express"
// import bodyParser from 'body-parser'
import cors from "cors"
import dotenv from "dotenv"
import { router } from "./routes/router.js"
import helmet from "helmet"
import logger from "morgan"
// import { connectDB } from "./mongoose/mongoose.js"
dotenv.config()

/**
 * The main function of the server.
 */
const main = async () => {
  //Connect to DB
  // await connectDB()

  const app = express()
  const PORT = process.env.PORT || 5000

  app.use(helmet())

  // Set various HTTP headers to make the application a little more secure
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'"],
      },
    })
  )
  app.use(logger("dev"))

  // Parse requests of the content type application/x-www-form-urlencoded.
  // Populates the request object with a body object (req.body).
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  // Executes middleware before the routes.
  app.use((req, res, next) => {
    next()
  })

  // Set routing
  app.use("/", router)

  // Error handler.
  app.use((err, req, res, next) => {
    err.status = err.status || 500
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    })
    console.log("Server", err.message)
    return
  })

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
    console.log("Ctrl-c to close server")
  })
}

main()
