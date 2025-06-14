const express = require('express')
require('dotenv').config()
const contactsRouter = require('./routes/contacts')
const clientsRouter = require('./routes/clients')
const errorHandler = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const logger = require('morgan')

connectDB()
const app = express()

// middleware
app.use(express.json())
app.use(logger('dev'))

// In Express middleware, the next() function is essential because it tells Express to: Move on to the next middleware or route handler
// const loggerMiddleware = (req, res, next) => {
//     console.log(`${new Date()} -- Request [${req.method}] [${req.url}]`)
//     next()
// }

// routes
app.use('/api/contacts', contactsRouter)
app.use('/api/clients', clientsRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})