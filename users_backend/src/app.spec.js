const app = require('./app');
const request = require('supertest')(app);
const UserRepository = require("./user_repository");
const {MongoClient} = require('mongodb');


describe('User management API',()=>{

    let repository;
    let client;

    beforeAll(async()=>{
        //Connects to database
        const dsn = 'mongodb://root:root@localhost?retryWrites=true&writeConcern=majority' 
        client = new MongoClient(dsn);
        await client.connect();
        const collection = client.db('app_db').collection('users');
        //creates a new user repository
        repository = new UserRepository(collection);
    });

    afterAll(async()=>{
        await client.close();
    });

    beforeEach(async()=>{
        await repository.deleteAll();
    });


    describe('Collection Endpoints',()=>{
        test('Endpoint for listing all users       (GET /users)',async()=>{
            //Create a user
            await repository.create({
                userId:"555",
                name:"Artur Correa",
                email:'accorrea@gmail.com',
                password:'123456'
            });
            //Request the list of users
            const response = await request
                .get('/users')
                .expect('Content-type',/application\/json/);
            expect(response.statusCode).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toStrictEqual(expect.objectContaining({
                userId:"555",
                name:"Artur Correa",
                email:'accorrea@gmail.com',
                password:'123456'
            }));
        });

        test('Endpoint for creating new user       (POST /users)',async()=>{
            
            const user = {
                userId:"555",
                name:"Artur Correa",
                email:'accorrea@gmail.com',
                password:'123456'
            };
            
            const response = await request
                .post('/users')
                .send(user);
            expect(response.statusCode).toBe(201);
            expect(response.body).toStrictEqual(expect.objectContaining(user));
        }); 
    });

    describe('Item endpoints',()=>{
        describe('Endpoint for geting user details     (GET /users/:id)',()=>{
            test('Must return 200 for an existing user',async()=>{
                //1. Create a user
                const user = await repository.create({
                    userId:"555",
                    name:"Artur Correa",
                    email:'accorrea@gmail.com',
                    password:'123456'
                });    
                //2. Request user details and check response headers
                const response = await request
                    .get(`/users/${user._id}`)
                    .expect('Content-type',/application\/json/);
                //3. check status code
                expect(response.statusCode).toBe(200);
                //4. Check the body
                expect(response.body).toStrictEqual(expect.objectContaining({
                    userId:"555",
                    name:"Artur Correa",
                    email:'accorrea@gmail.com',
                    password:'123456'
                }));
            });

            test('Must return 404 for a non existing user',async()=>{
                //1. Request user details and check response headers
                const response = await request
                    .get('/users/649b7a272150835d525b7335')
                    .expect('Content-type',/application\/json/);
                //2. check status code
                expect(response.statusCode).toBe(404);
                //3. Check the body
                expect(response.body).toStrictEqual(expect.objectContaining({
                    status: 404,
                    error: 'User not found'
                }));
            });
        });

        describe('Endpoint for updating user           (PUT /users/:id)',()=>{
            test('Must return 200 for an existing user',async()=>{
                //1. Create a user
                const user = await repository.create({
                    userId:"555",
                    name:"Artur Correa",
                    email:'accorrea@gmail.com',
                    password:'123456'
                });
                //2. Request user update and check the headers
                const response = await request.put(`/users/${user._id}`)
                    .send({
                        userId:"86",
                        name:"Adriana Carneiro",
                        email:'acarneiro@gmail.com',
                        password:'password'
                    })
                    .expect('Content-type',/application\/json/);
                //3. Check status code
                expect(response.statusCode).toBe(200);
                //4. Check the body
                expect(response.body).toStrictEqual(expect.objectContaining({
                    userId:"86",
                    name:"Adriana Carneiro",
                    email:'acarneiro@gmail.com',
                    password:'password'
                }));
                //5. Check if the user was updated
                const newUser = await repository.findById(user._id);
                expect(newUser).toStrictEqual(expect.objectContaining({
                    userId:"86",
                    name:"Adriana Carneiro",
                    email:'acarneiro@gmail.com',
                    password:'password'
                }));
            });
            test('Must return 404 for a non existing user',async()=>{
                //1. Request user details and check response headers
                const response = await request
                    .put('/users/649b7a272150835d525b7335')
                    .send({
                        userId:"555",
                        name:"Artur Correa",
                        email:'accorrea@gmail.com',
                        password:'123456'
                    })
                    .expect('Content-type',/application\/json/);
                //2. check status code
                expect(response.statusCode).toBe(404);
                //3. Check the body
                expect(response.body).toStrictEqual(expect.objectContaining({
                    status: 404,
                    error: 'User not found'
                }));
            });
        });

        describe('Endpoint for removing user           (DELETE /users/:id)',()=>{
            test('Must return 204 for an existing user',async()=>{
                //1. Create a user
                const user = await repository.create({
                    userId:"555",
                    name:"Artur Correa",
                    email:'accorrea@gmail.com',
                    password:'123456'
                });
                //2. Request user delection
                const response = await request.delete(`/users/${user._id}`);
                //3. Check status code
                expect(response.statusCode).toBe(204);
                //4. Check the body
                expect(response.body).toStrictEqual({});
                //5. Check if the user was deleted
                const newUser = await repository.findById(user._id);
                expect(newUser).toBe(null);
            });
            test('Must return 404 for a non existing user',async()=>{
                //1. Request user deletion and check response headers
                const response = await request
                    .delete('/users/649b7a272150835d525b7335');
                //2. check status code
                expect(response.statusCode).toBe(404);
                //3. Check the body
                expect(response.body).toStrictEqual(expect.objectContaining({
                    status: 404,
                    error: 'User not found'
                }));
            });
        });

    });
});