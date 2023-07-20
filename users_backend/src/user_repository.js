const mongo = require('mongodb');
class UserRepository{
    collection; 

    constructor(collection){
        this.collection = collection;
    }

    //Clear database 
    async deleteAll(){
        await this.collection.deleteMany({});
    }

    async create(user){
        await this.collection.insertOne(user);
        return user;
    }

    async findAll(){
        return (await this.collection.find({})).toArray();
    }

    async update(user){
        await this.collection.updateOne({_id:user._id},{$set:user});
    }

    async findById(id){
        return await this.collection.findOne({_id:new mongo.ObjectId(id)});
    }

    async delete(user){
        if (user._id === undefined) {
            throw new Error('Invalid User');
        }
        await this.collection.deleteOne({_id:user._id});
    }
}
module.exports=UserRepository;