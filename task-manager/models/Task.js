const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    name: {
        type: String,
        // required: true
        required: [true, 'must provide name'],
        trim: true,
        maxLength: [20, 'name cannot be more than 20 characters']
    },
    completed: {
        type: Boolean,
        default: false
    }  
})

const Task = mongoose.model('task', TaskSchema);
module.exports = { Task }