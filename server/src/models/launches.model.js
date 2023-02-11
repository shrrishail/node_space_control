const axios = require('axios');

const launches = require('./launch.mongo');
const planets = require('./planet.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const getAllLaunches = async (querySkip, queryLimit) => {
    return await launches
                    .find({}, {'_id': 0, '__v': 0})
                    .sort({flightNumber: 1})
                    .skip(querySkip)
                    .limit(queryLimit);
}

const isValidLaunch = async (launch) => {
    const planet = await planets.findOne({keplerName: launch.target});

    if(!planet) return 'Invalid target planet!'
    if(!launch.mission) return "Mission name cannot be empty!";
    if(!launch.launchDate) return "Mission date cannot be empty!";
    if(!launch.rocket) return "Mission rocket cannot be empty!";
    if(!launch.target) return "Mission target/destination cannot be empty!";
    if(new Date(launch.launchDate).toString() === 'Invalid Date') return "Date is not valid";

    return "";
}

const addNewLaunch = async (launch) => {
    const newFlightNumber = await getLatestFlightNumber() + 1;
    
    const newLaunch = Object.assign(launch, {
        customers: ['ZeroToMastery', 'NASA Internal'],
        flightNumber: newFlightNumber,
        upcoming: true,
        success: true,
    })
    await saveLaunch(newLaunch);
    return newFlightNumber;
}

const saveLaunch = async (launch) => {
    await launches.findOneAndUpdate(
        {flightNumber: launch.flightNumber}, 
        launch, 
        {upsert: true}
    );
}

const getLaunchById = async (flightNumber) => {
    return await launches.findOne({flightNumber});
}

const getLatestFlightNumber = async () => {
    const latestLaunch = await launches.findOne().sort('-flightNumber');
    
    if(!latestLaunch) return DEFAULT_FLIGHT_NUMBER;

    return latestLaunch.flightNumber;
}

const abortLaunchById = async (flightNumber) => {
    try {    
        await launches.findOneAndUpdate(
            {flightNumber}, 
            {upcoming: false, success: false}
        );
        return true;   
    } catch (error) {
        console.error(`Could not abort launch ${error}`);
        return false;
    }
}

function transformLaunches(launches) {
    const transformedArray = [];
    
    const getCustomers = (payloads) => {
        const arr = [];
        for(let payload of payloads) {
            arr.push(...payload['customers'])
        }
        return arr;
    }

    for(let launch of launches){
        const newLaunch = {
            flightNumber: launch['flight_number'],
            mission: launch['name'],
            upcoming: launch['upcoming'],
            success: launch['success'],
            customers: getCustomers(launch['payloads']),
            target: '',
            rocket: launch['rocket']['name'],
            launchDate: launch['date_local']
        }
        saveLaunch(newLaunch);
    }
}

async function loadLaunchesData() {
    const firstLaunch = await getLaunchById(1);

    if(firstLaunch) {
        console.log('Launches data already loaded.');
    } else {
        const response = await axios.post(SPACEX_API_URL, {
            query: {},
            options: {
                pagination: false,
                populate: [
                    {
                        path: 'rocket',
                        select: {
                            name: 1
                        }
                    },
                    {
                        path: 'payloads',
                        select: {
                            customers: 1
                        }
                    }
                ]
            }
        });

        if(response.status !== 200) {
            console.log('Could not download external launches data!');
            return;
        }
    
        const launchDocs = response.data.docs;
        const transformedLaunches = transformLaunches(launchDocs); 
    }   
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    isValidLaunch,
    getLaunchById,
    abortLaunchById,
    loadLaunchesData
}

