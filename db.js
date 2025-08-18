const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook"
require('dotenv').config(); //  this is mandatory to read .env variables
// const mongoURI = process.env.MONGO_URI;


const connectToMongo = async () => {
try {
    mongoose.set('strictQuery', false)
    mongoose.connect(mongoURI) 
    console.log('Mongo connected')
}
catch(error) {
    console.log(error)
    process.exit()
}
}
module.exports = connectToMongo;