const mongoose = require('mongoose');

const modelName = 'Launch';

const launchSchema = new mongoose.Schema({
    flightNumber: {
        type: Number, 
        required: true
    },
    mission: {
        type: String, 
        required: true
    },
    rocket: {
        type: String, 
        required: true
    },
    target: {
        type: String, 
    },
    launchDate: {
        type: Date, 
        required: true
    },
    customers: [String],
    upcoming: {
        type: Boolean, 
        default: true
    },
    success: {
        type: Boolean, 
        default: true
    },
});

module.exports = mongoose.model(modelName, launchSchema);