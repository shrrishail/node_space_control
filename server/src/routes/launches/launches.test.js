const request = require('supertest');
const app = require('../../app');
const { loadPlanetsData } = require('../../models/planets.model');
const { connectToMongo, disconnectFromMongo } = require('../../services/mongo');

describe('Launches API', () => {
    //setup logic
    beforeAll(async () => {
        await connectToMongo();
        await loadPlanetsData();
    });

    afterAll(async () => {
        await disconnectFromMongo();
    })

    //test logic
    describe('Test GET /launches', () => {
        test('It should respond with 200 success', async () => {
            const response = await request(app)
                .get('/launches')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });

    describe('Test POST /launches', () => {
        const completeLaunchData = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate: 'January 4, 2028',
        };
        
        const launchDataWithoutDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
        };

        const launchDataWithInvalidDate = {
            mission: 'USS Enterprise',
            rocket: 'NCC 1701-D',
            target: 'Kepler-62 f',
            launchDate: 'zoot',
        };

        test('It should respond with 201 created', async () => {
            const response = await request(app)
                .post('/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);

            const responseLaunchDate = new Date(response.body.launchDate).valueOf();
            const requestLaunchDate = new Date(completeLaunchData.launchDate).valueOf();
            console.log({responseLaunchDate, requestLaunchDate});

            expect(responseLaunchDate).toBe(requestLaunchDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });

        test('It sould catch missing required properties', async () => {
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
            
            expect(response.body).toStrictEqual({message: "Mission date cannot be empty!"});
            
        });

        test('It sould catch invalid dates', async () => {
            const response = await request(app)
                .post('/launches')
                .send(launchDataWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({message: "Date is not valid"});
        });
    });
})
