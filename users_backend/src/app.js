const UserRepository = require("./user_repository");
const {MongoClient} = require('mongodb');
const cors = require('cors');
const express = require('express');
const { debug } = require("console");
const app = express();
app.use(express.json());
app.use(cors({
    exposedHeaders:['x-total-count'],
}));

const normalizePk = (user) =>{
    user.id = user._id;
    delete user._id;
    return user;
}

const dsn = 'mongodb://root:root@localhost?retryWrites=true&writeConcern=majority' 
client = new MongoClient(dsn);

app.get('/users',async(request,response)=>{

    await client.connect();
    const collection = client.db('app_db').collection('users');
    repository = new UserRepository(collection);

    const users = (await repository.findAll()).map(normalizePk);

    await client.close();
    response.set('X-total-Count',users.lenght);
    response.json(users);
});

app.post('/users',async(request,response)=>{
    
    await client.connect();
    const collection = client.db('app_db').collection('users');
    repository = new UserRepository(collection);
    try{
        const user = await repository.create(request.body);
        response.status(201).json(normalizePk(user));
    }catch(e){
        response.status(500).json({error:e.message});
    }
    await client.close();
});

app.get('/users/:id',async(request,response)=>{
    await client.connect();
    const collection = client.db('app_db').collection('users');
    repository = new UserRepository(collection);
    try{
        const user = await repository.findById(request.params.id);

        if(user === null){
            response.status(404).json({
                status: 404,
                error: 'User not found'
            })
        }else{
            response.json(normalizePk(user));
        }

    }catch(e){
        console.log(e);
        response.status(500).json({error:e.message});
    }

    await client.close();
});

app.put('/users/:id',async(request,response)=>{
    await client.connect();
    const collection = client.db('app_db').collection('users');
    repository = new UserRepository(collection);
    const user = await repository.findById(request.params.id);

    if(user === null){
        response.status(404).json({
            status:404,
            error:'User not found'
        })}else{
        const newUser = {...user,...request.body};
        await repository.update(newUser);
        response.json(normalizePk(newUser));
    }

    await client.close();
})

app.delete('/users',async(request,response)=>{
    await client.connect();
    const collection = client.db('app_db').collection('users');
    repository = new UserRepository(collection);
    const user = await repository.deleteAll();
    response.sendStatus(204);
    await client.close();
});

app.delete('/users/:id',async(request,response)=>{
    await client.connect();
    const collection = client.db('app_db').collection('users');
    repository = new UserRepository(collection);
    const user = await repository.findById(request.params.id);

    if(user === null){
        response.status(404).json({
            status:404,
            error:'User not found'
        })}else{
            try{
                await repository.delete(user);
                response.sendStatus(204);
            }catch(e){
                console.log(e.message);
                response.send(e.message);
            }
        
    }

    await client.close();
})


module.exports = app;