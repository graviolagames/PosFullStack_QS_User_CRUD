const UserRepository = require("./user_repository");
const {MongoClient} = require('mongodb');

describe("UserRepository",()=>{

    let repository;
    let client;

    beforeAll(async()=>{
        //Connects to database
        const dsn = 'mongodb://root:root@localhost?retryWrites=true&writeConcern=majority' 
        client = new MongoClient(dsn);
        await client.connect();
        const collection = client.db('app_db').collection('users');
        //creates a new repository
        repository = new UserRepository(collection);
    });

    afterAll(async()=>{
        await client.close();
    });

    beforeEach(async()=>{
        await repository.deleteAll();
    });

    test('Repository must create a new user (C)', async ()=>{

        const result = await repository.create({
            userId:555,
            name:"Artur Correa",
            email:'accorrea@gmail.com',
            password:'123456'
        });
        
        //Check results
        expect(result).toStrictEqual(
            expect.objectContaining({
                userId:555,
                name:"Artur Correa",
                email:'accorrea@gmail.com',
                password:'123456'
            })   
        );

        //Check if the new user was really persisted
        const users = await repository.findAll();
        expect(users.length).toBe(1);
        expect(users[0]).toStrictEqual(
            expect.objectContaining({
                userId:555,
                name:"Artur Correa",
                email:'accorrea@gmail.com',
                password:'123456'
            })
        );

    });

    test('Repository must list all users (R)', async () => {

        await repository.create({
            userId:555,
            name:"Artur Correa",
            email:'accorrea@gmail.com',
            password:'123456'
        });

        const result = await repository.findAll();

        expect(result.length).toBe(1);

        expect(result[0]).toStrictEqual(
            expect.objectContaining({
                userId:555,
                name:"Artur Correa",
                email:'accorrea@gmail.com',
                password:'123456'
            })
        );
    });

    test('Repository must update a user (U)',async()=>{
        //1. Database must be empty (ok)
        //2. Insert a user
        const user = await repository.create({
            userId:555,
            name:"Artur Correa",
            email:'accorrea@gmail.com',
            password:'123456'
        });
        //3. update the user
        user.userId = 42,
        user.name = 'Antony Smith';
        user.email = 'asmith@gmail.com';
        user.password = 'password';
        await repository.update(user);
        //4. check if the user was updated on the database
        const result = await repository.findById(user._id);
        expect(result).toStrictEqual(expect.objectContaining({
            userId:42,
            name: 'Antony Smith',
            email: 'asmith@gmail.com',
            password: 'password'
        }));
    });
    test('Repository must remove an user (D)',async()=>{
        
        //1. database must be empty. (ok)
        //2. The database must contain a user
        const user = await repository.create({
            userId:555,
            name:"Artur Correa",
            email:'accorrea@gmail.com',
            password:'123456'
        });
        //2. Remove the user
        await repository.delete(user);

        //3. check if the user was removed
        const result = await repository.findAll();
        expect(result.length).toBe(0);
    });
});