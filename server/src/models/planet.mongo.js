const mongoose = require('mongoose');

const planetModelName = 'Planet';
const planetSchema = new mongoose.Schema({
    keplerName: {type: String, required: true},
});

module.exports = mongoose.model(planetModelName, planetSchema);