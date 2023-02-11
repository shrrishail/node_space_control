const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
    console.log('MongoDB connected!');
});

mongoose.connection.on('error', () => {
    console.log(`Error occured while connecting to MongoDB`);
})

async function connectToMongo() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

async function disconnectFromMongo() {
    await mongoose.disconnect();
}

module.exports = {
    connectToMongo,
    disconnectFromMongo
}