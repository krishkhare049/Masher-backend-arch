const User = require("../models/userModel");

// Function to generate a unique username
async function generateUniqueUsername(fullName) {
    const nameParts = fullName.split(" ");
    const firstName = nameParts[0].toLowerCase(); // Convert to lowercase
    const lastName = nameParts[nameParts.length - 1].toLowerCase(); // Convert to lowercase
    let username = `${firstName}${lastName}`; // Attempt with full name concatenation
    let attempt = 1;

    // Check if the username exists in the database
    while (true) {
        const existingUser  = await User.findOne({ username }, {_id: 1});
        if (!existingUser ) {
            // Username is unique, return it
            return username;
        }

        // If username exists, modify it by appending a number
        username = `${firstName}${lastName}${attempt}`;
        attempt++;
    }
}

module.exports = generateUniqueUsername