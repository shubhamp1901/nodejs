require('dotenv').config()

const express = require('express')
const app = express()
const taskRoutes = require('./routes/tasks')
const productRoutes = require('./routes/products')
const connectDB = require('./db/connect')
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// middleware
// Parses incoming JSON payloads into req.body
app.use(express.json())


// routes
app.use('/api/tasks', taskRoutes)
app.use('/api/products', productRoutes)
// Sends 404 if no route matches.
app.use(notFound)
// Handles server/internal errors centrally.
app.use(errorHandlerMiddleware)

const PORT = 5000 || process.env.PORT

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, console.log(`Server running on port ${PORT}`))
    } catch (error) {
        console.log(error)
    }
}

start()

