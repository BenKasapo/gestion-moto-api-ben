const express = require("express")
const server = express()
const cors = require("cors")
const dotenv = require("dotenv")
const passport = require("passport")
const authRouter = require("./routes/auth")
const associationRouter = require("./routes/associations")
const contributionRouter = require("./routes/contributions")
const notificationRouter = require("./routes/notifications")
const permissionRouter = require("./routes/permissions")
const periodRouter = require("./routes/periods")
const vehicleRouter = require("./routes/vehicles")
const programRouter = require("./routes/programs")
const contribTypeRouter = require("./routes/type-contributions")
const userRouter = require("./routes/users")
const profileRouter = require("./routes/profiles")
const paymentRouter = require("./routes/payments")
const LocalStrategy = require("./config/passport")
const { findUserByMailOrPhone } = require("./database/requests")
const checkUserAuthenticated = require("./middlewares/checkUserAuthenticated")
const passwordResetRouter = require("./routes/password")
const succursaleRouter = require("./routes/succursales") // Import the succursale routes
const statisticsRouter = require("./routes/statistics")

// Import the cleanup service (this will start the cron job)
require("./services/paymentCleanupService")

// Configurations
dotenv.config()
passport.use(LocalStrategy)
const port = process.env.PORT

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (identifier, done) => {
  const user = await findUserByMailOrPhone(identifier, identifier)
  if (user) {
    done(null, user)
  }
  done({ message: "User doesn't exist" }, false)
})

// Middlewares
server.use(cors())
server.use(express.json())

// Main route
server.get("/", (req, res) => {
  res.send("API de gestion de motos")
})

// Routers
server.use(authRouter)
server.use("/associations", associationRouter)
server.use("/contributions", contributionRouter)
server.use("/notifications", notificationRouter)
server.use("/programs", programRouter)
server.use("/permissions", permissionRouter)
server.use("/contribution-types", contribTypeRouter)
server.use("/users", userRouter)
server.use("/profiles", profileRouter)
server.use("/payments", paymentRouter)
server.use("/reset_password", passwordResetRouter)
server.use("/succursales", succursaleRouter)
server.use("/periods", periodRouter)
server.use("/vehicles", vehicleRouter)
server.use("/statistics", statisticsRouter)

server.listen(port, () => {
  console.log(`Server listening on port : ${port}`)
})
