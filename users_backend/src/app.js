const UserRepository = require("./user_repository");
const {MongoClient} = require('mongodb');

const express = require('express');
const app = express();
app.use(express.json());
const dsn = 'mongodb://root:root@localhost?retryWrites=true&writeConcern=majority' 
client = new MongoClient(dsn);

app.get('/users',async(request,response)=>{

    await client.connect();
    const collection = client.db('app_db').collection('users');
    repository = new UserRepository(collection);

    const users = await repository.findAll();
    await client.close();
    
    response.json(users);
});

app.post('/users',async(request,response)=>{
    
    await client.connect();
    const collection = client.db('app_db').collection('users');
    repository = new UserRepository(collection);
    
    try{
        const user = await repository.create(request.body);
        response.status(201).json(user);
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
            response.json(user);
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
        response.json(newUser);
    }

    await client.close();
})

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