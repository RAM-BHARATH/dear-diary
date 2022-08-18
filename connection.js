// Do not change this file
require('dotenv').config();
// const { MongoClient } = require('mongodb');
var mongoose = require('mongoose');

async function main(callback) {
    // const URI = process.env.MONGO_DB_URI; // Declare MONGO_URI in your .env file
    // const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // try {
    //     // Connect to the MongoDB cluster
    //     await client.connect();

    //     // Make the appropriate DB calls
    //     await callback(client);

    // } catch (e) {
    //     // Catch any errors
    //     console.error(e);
    //     throw new Error('Unable to Connect to Database')
    // }

    const mongoDB = process.env.MONGO_DB_URI;
    try{
        mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        await callback(db)
    } catch(e){
        console.error(e);
        throw new Error('Unable to connect to DB')
    }
}

module.exports = main;