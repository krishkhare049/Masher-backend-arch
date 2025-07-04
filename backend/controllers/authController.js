const User = require('../models/userModel'); // Importing the User model
const {remove_whitespaces} = require('../utils/utils')
const generateUniqueUsername = require('../utils/generateUniqueUsername')

const bcrypt = require('bcrypt')

// Signup function
async function signup(req, res) {
        console.log('User is trying signup')

    try {
        const user_email = req.body.user_email;
        const user_email_check = await User.findOne({
            user_email: user_email,
        });

        if (!user_email_check) {

            const username = await generateUniqueUsername(req.body.full_name);

            const data = new User({
                joined: new Date(),
                username: username,
                full_name: req.body.full_name,
                user_email: req.body.user_email,
                user_password: req.body.user_password,
            });

            let new_doc = await data.save();
            const token = await new_doc.generateAuthToken();

            res.json({ token: token, message: 'signed_up_successfully' });
        } else {
            res.json({ token: 'no_token', message: 'account_already_exists' });
        }
    } catch (error) {
        console.log(error);
    }
}

// Login function
async function login(req, res) {
    try {
        console.log('User is tryinig login')
        const login_email = req.body.login_email;
        const login_password = remove_whitespaces(req.body.login_password); // should validate in client-side instead

        // console.log(login_email, login_password);

        const user = await User.findOne(
            { user_email: login_email },
            { user_email: 1, user_password: 1, tokens: 1 }

        );
        // console.log(user);

        if (user) {
            const isPasswordMatch = await bcrypt.compare(
                login_password,
                user.user_password
            );

            if (isPasswordMatch) {
                const token = await user.generateAuthToken();
                res.json({ token: token, message: 'logged_in_successfully' });
            } else {
                res.json({ token: 'no_token', message: 'user_not_found' });

            }
        } else {
            res.json({ token: 'no_token', message: 'user_not_found' });
        }
    } catch (error) {
        console.log(error);
        res.json({ token: 'no_token', message: 'user_not_found' });
    }
}

module.exports = { signup, login }; // Exporting the functions