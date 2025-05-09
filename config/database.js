const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const dbconnection = () => {

    mongoose.connect(process.env.DB_URI).then((conn) => {
        console.log('MongoDB connected successfully!');
        console.log(`Database name: ${conn.connection.host}`);
        console.log(`Database name: ${conn.connection.name}`);
    })
}

module.exports = dbconnection;