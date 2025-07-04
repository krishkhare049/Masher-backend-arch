// const mongoose = require('mongoose');
// const { MONGO_URI } = process.env;

// function connect() {
//     mongoose.connect(MONGO_URI, {

//         // Learn about some options-

//         // useNewUrlParser: true,
//         // useUnifiedTopology: true
//     }).then(() => {
//         console.log("Successfully connected to database")
//     }).catch((error) => {
//         console.log(error)
//         console.log("Database connection failed. exiting now...");
//     })
// }

// module.exports = {connect}

const mongoose = require('mongoose');

const { MONGO_URI } = process.env;

let isConnected = false; // Track connection state

async function connect() {
    if (isConnected) {
        console.log("✅ Database already connected. Reusing connection.");
        return ;
    }

    try {
        await mongoose.connect(MONGO_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            serverSelectionTimeoutMS: 20000, // increase timeout to 20s
            maxPoolSize: 20, // ✅ Use a connection pool (20 connections max)
        });

        isConnected = true;
        console.log("✅ Successfully connected to the database");

    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Exit if database connection fails
    }

}

module.exports = { connect }; // Export mongoose instance
