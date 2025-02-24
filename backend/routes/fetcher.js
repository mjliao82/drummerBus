const express = require('express');
const router = express.Router();
const supabase = require('../db');


router.get('/bookings', async(req, res) => {
    try {
        const {data, err} = await supabase 
        .from('lessons')
        .select('*');
        if (err) {
            console.error("supabase error: ", err);
            return res.status(500).json({ error: 'Failed to fetch bookings from database' });
        }
        res.json(data); 
    } catch (error) {
        console.error("Unexpected error during login:", error);
        res.status(500).json({ error: "Internal server error." });
    }
})





module.exports = router;