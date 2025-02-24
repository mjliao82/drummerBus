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


router.get('/me', async (req, res) => {
    const token = req.cookies.auth_token; // ✅ Read cookie from request

    if (!token) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret'); // ✅ Verify JWT
        res.json({ user: decoded }); // ✅ Send user details back
    } catch (err) {
        return res.status(403).json({ message: "Invalid token." });
    }
});

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



router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const { data: user, error } = await supabase
            .from('accounts')
            .select('id, name, email, phone, address, password, role')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        if (user.role !== role) {
            return res.status(403).json({ message: `Access denied. You cannot log in as ${role}.` });
        }

        const valid_login = await bcrypt.compare(password, user.password);
        if (!valid_login) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1h' }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000,
        });

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error("🔥 Unexpected error during login:", error);
        res.status(500).json({ error: "Internal server error." });
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