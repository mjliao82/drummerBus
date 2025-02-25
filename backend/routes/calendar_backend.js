const express = require('express');
const router = express.Router();
const supabase = require('../db'); // Adjust for your Supabase setup

// return all lessons from db
router.get('/api/bookings', async (req, res) => {
    const { data, error } = await supabase
        .from('bookings')
        .select('id, requested_date, requested_time, duration_minutes, location, status, students(name), instrument');
    
    if (error) return res.status(500).json({ error: error.message });

    res.json(data.map(lesson => ({
        id: lesson.id,
        requested_date: lesson.requested_date,
        requested_time: lesson.requested_time,
        duration_minutes: lesson.duration_minutes,
        location: lesson.location,
        status: lesson.status,
        student_name: lesson.students?.name,
        instrument: lesson.instrument,
    })));
});

// Add a new lesson to db 
router.post('/api/bookings', async (req, res) => {
    const { student_id, instrument, requested_date, requested_time, duration_minutes, location, notes, status } = req.body;
    
    const { data, error } = await supabase
        .from('bookings')
        .insert([{ student_id, instrument, requested_date, requested_time, duration_minutes, location, notes, status }])
        .select('*')
        .single();
    
    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
});

module.exports = router;
