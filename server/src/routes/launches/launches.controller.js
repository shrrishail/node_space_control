const { 
    getAllLaunches, 
    addNewLaunch, 
    isValidLaunch, 
    getLaunchById, 
    abortLaunchById 
} = require("../../models/launches.model");
const { getPagination } = require("../../services/query");

async function httpGetAllLaunches(req, res) {
    const {skip, limit} = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit);
    return res.json(launches);
}

//create a launch in the launches collection
async function httpPostLaunch(req, res) {
    const newLaunch = req.body;
    const errorMsg = await isValidLaunch(newLaunch);
    if(errorMsg) return res.status(400).json({message: errorMsg});

    await addNewLaunch(newLaunch);
    return res.status(201).json(newLaunch);
}

//find and abort the launch
async function httpDeleteLaunch(req, res) {
    const launchId = Number(req.params.launchId);
    if(isNaN(launchId)) {
        return res.status(400).json({message: 'Invalid launch ID!'});
    }
    const launch = getLaunchById(launchId);

    if(launch) {
        let aborted = await abortLaunchById(launchId);
        if(!aborted) {
            return res.status(400).json({message: 'Launch not aborted!'})
        } else{
            return res.status(200).json({message: 'Launch aborted successfully.'})
        }
    } else {
        return res.status(404).json({message: `Could not find launch with ID - ${launchId}!`});
    }
}

module.exports = {
    httpGetAllLaunches,
    httpPostLaunch,
    httpDeleteLaunch
}