const mongoose = require('mongoose')


const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Connected to DB: ${connect.connection.name}`)
    } catch (error) {
        console.log("Failed to connect to DB!")
    }
}

module.exports = connectDB