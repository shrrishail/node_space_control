const {parse} = require('csv-parse');
const fs = require('fs');
const planets = require('../models/planet.mongo');
const path = require('path');

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', 'data', 'kepler-data.csv')).pipe(parse({
            comment: '#',
            columns: true,
        }))
        .on('data', (data) => {
            if(isHabitable(data)) {
                savePlanet(data);
            }
        }).on('error', err => {
            console.log('Error occurred!');
        }).on('end', async () => {
            const habitablePlanetsCount = (await getAllPlanets()).length;
            console.log('Done reading planets data.')
            console.log(`Number of habitable planets - ${habitablePlanetsCount}`);
            resolve();
        });
    })
}

const savePlanet = async (planet) => {
    try {
        await planets.updateOne(
            {keplerName: planet.kepler_name}, 
            {keplerName: planet.kepler_name}, 
            {upsert: true}
        );   
    } catch (error) {
        console.error(`Could not save a planet ${error}`);
    }
}

const isHabitable = (data) => {
    return data['koi_disposition'] === 'CONFIRMED' 
    && data['koi_insol'] > 0.36 
    && data['koi_insol'] < 1.11 
    && data['koi_prad'] < 1.6;
}

const getAllPlanets = async () => {
    return await planets.find({});
}

module.exports = {
    getAllPlanets,
    loadPlanetsData
}