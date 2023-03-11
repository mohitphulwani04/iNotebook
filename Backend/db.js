const mongoose = require('mongoose');
const connectToMongo = () => {
    mongoose.connect(process.env.mongoURI, () => {
        console.log("Connected to Mongo Successfully");
    })
}

module.exports = connectToMongo;