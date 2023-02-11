const express = require('express');
const { httpGetAllLaunches, httpPostLaunch, httpDeleteLaunch } = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpPostLaunch);
launchesRouter.delete('/:launchId', httpDeleteLaunch);

module.exports = launchesRouter;