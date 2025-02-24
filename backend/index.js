require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 5001;
const authRoutes = require('./routes/auth'); // includes register, login, logout

// Middleware
app.use(express.json());
app.use(cookieParser())
app.use(
    cors({
      origin: 'http://localhost:5173', // ✅ Replace with frontend URL
      credentials: true, // ✅ Allow credentials (cookies)
    })
  );
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

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 5002 }); // WebSocket runs on a different port

wss.on('connection', (ws) => {
    console.log('📡 Client connected via WebSocket');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log(' New Booking Received:', data);

        if (!data.userId || !data.instrument || !data.day || !data.time) {
            ws.send(JSON.stringify({ error: "Missing required booking fields!" }));
            return;
        }

        // TODO: Store booking in database
        console.log("✅ Booking Stored in Database:", {
            userId: data.userId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address, // ✅ Store address
            instrument: data.instrument,
            duration: data.duration,
            day: data.day,
            time: data.time,
        });

        ws.send(JSON.stringify({ message: "Booking received successfully!" }));
    });

    ws.on('close', () => {
        console.log('❌ Client disconnected');
    });
});
