const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const supabase = require('../db');


async function Register(name, email, password, phone, address, role, subRole) {
    const { data, error } = await supabase
        .from('accounts')  // ✅ Ensure 'account' is the correct table name
        .insert({
            name: name,
            email: email,
            password: password, 
            phone: phone,
            address: address,
            role: role,       
            subRole: subRole,  
            created_at: new Date(), 
        })
        .select();

    if (error) {
        console.error("🔥 Supabase Error:", error); // ✅ Log Supabase error
        return null;
    }

    console.log("✅ Inserted into Supabase: ", data);
    return data;
}


// Register account POST request
router.post('/register', async (req, res) => {
    console.log("Received data:", req.body); // ✅ Log incoming request

    const { name, email, password, confirmPassword, phone, address, subRole } = req.body;

    // Validation checks
    if (!name || name.trim() === '') {
        console.log("❌ Name validation failed");
        return res.status(400).json({ message: 'Full name is required' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        console.log("❌ Email validation failed");
        return res.status(400).json({ message: 'Valid email is required' });
    }
    if (!password || password.length < 8) {
        console.log("❌ Password validation failed");
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (password !== confirmPassword) {
        console.log("❌ Passwords do not match");
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    if (!phone || !/^\+?[0-9]{10,15}$/.test(phone)) {
        console.log("❌ Phone validation failed");
        return res.status(400).json({ message: 'Valid phone number is required' });
    }
    if (!address || address.trim() === '') {
        console.log("❌ Address validation failed");
        return res.status(400).json({ message: 'Address is required' });
    }
    if (!subRole || !['Student', 'Parent'].includes(subRole)) {
        console.log("❌ SubRole validation failed");
        return res.status(400).json({ message: 'Invalid subRole. Must be Student or Parent' });
    }

    console.log("✅ All validations passed. Proceeding with registration.");

    // Set role as 'client'
    const role = 'client';

    // Check if email already exists
    const { data: existingUser, error: emailError } = await supabase
        .from('accounts')
        .select('id')
        .eq('email', email)
        .single();

    if (emailError && emailError.code !== 'PGRST116') { // Ignore 'No rows found' error
        console.error("Error checking email:", emailError);
        return res.status(500).json({ message: 'Error checking email availability' });
    }
    if (existingUser) {
        return res.status(409).json({ message: 'Email is already registered' });
    }

    try {
        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Register user in Supabase
        const newUser = await Register(name, email, hashedPassword, phone, address, role, subRole);

        if (!newUser) {
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