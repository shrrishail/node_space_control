const express = require('express');
const {getAllPlanets} = require('../../models/planets.model');

const planetsRouter = express.Router();

planetsRouter.get('/', async (req, res) => {
    res.json(await getAllPlanets());
});

module.exports = planetsRouter;