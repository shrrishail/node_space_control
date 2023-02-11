const http = require('http');

require('dotenv').config();

const app = require('./app');
const {loadPlanetsData} = require('./models/planets.model');
const {loadLaunchesData} = require('./models/launches.model');
const {connectToMongo} = require('./services/mongo');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const startServer = async () => {
    await connectToMongo();
    await loadPlanetsData();
    await loadLaunchesData();
    
    server.listen(PORT, () => {
        console.log('Server listening on Port ', PORT, ' ...');
    })
}

startServer();

