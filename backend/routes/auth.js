const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const supabase = require('../db');


// Insert registered user to Supabase
async function Register(username, password, email) {
    const { data, error } = await supabase
    .from(/*drummer database*/)
    .insert({
        username: username,
        password: password,
        email:email,
    })
    .select(); // use this to return newly created record

    if (error) {
        console.error("Error inserting record into Supabase");
        return;
    }
    
    if (!data) {
        console.error("Record not created on Supabase insert");
    }

    console.log("Inserted record into Supabase: ", data);
    return data;
}



// Register account post request
router.post('/register', async(req, res) => {
    const {user, pw, email} = req.body;
    if (!user || user.trim() === '') {
        return res.status(400).json({ message: 'Username is required' });
    }
    
    if (!pw || pw.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Valid email is required' });
    }

    const {data, error} = await supabase
        .from('credentials')
        .select('id')
        .eq('username', user);
    
    if (error) {
        console.error("Error check for registering account query:", error)
        return res.status(500).json({ message: 'Error checking username availability' });
    }

    if (data) {
        return res.status(409).json({ message: 'Username is already taken. Please choose a different one.' });
    }

    try {
        // salt user password
        const stored_pw = await bcrypt.hash(pw, 10);

        // register user into credentials table
        const new_user = await Register(user, stored_pw, email); // Define Register function

        if (!new_user) {
            return res.status(500).json({ message: 'Failed to register user' });
        }
        res.status(201).json({
            message: 'Registration successful. Waiting for management to approve your account.',
        });

    } catch (error) {
        console.error('Unexpected error during registration:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login account
router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try {
        const {data, error} = await supabase
            .from('credentials')
            .select('id, password')
            .eq('username', username);
        
        if (error) {
            console.error("Database query error", error)
            return res.status(500).json({ message: 'Error checking username availability' });
        }

        if (!data) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        const {id, password: stored_pw} = data;
        const valid_login = await bcrypt.compare(password, stored_pw);
        if (!valid_login) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Create JWT token
        const token = jwt.sign(
            {id: id, username: username}, 
            // process.env.SECRET_KEY, 
            {expiresIn: '1h'}
        );

        // send auth token back in response
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: false, // set true when running on HTTPS
            sameSite: 'Strict',
            maxAge: 360000,
        });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error("Unexpected error during login.");
        res.status(500).json({error: "Internal server error."});
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie('auth_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
    });
    res.status(200).json({message: "Logged out successfully!"});
});

module.exports = router;