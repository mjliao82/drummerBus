require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5001;
const authRoutes = require('./routes/auth'); // includes register, login, logout

// Middleware
app.use(express.json());
app.use(cors()); 
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
    res.send('Express backend is running!');
});

// Use routes
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
