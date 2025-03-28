require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 5001;
const authRoutes = require('./routes/auth'); // includes register, login, logout
const fetcher = require('./routes/fetcher');
const stripeRoutes = require('./routes/stripe');

app.use('/stripe/webhook', express.raw({type: "application/json"}));
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
app.use('/fetch', fetcher);
app.use('/stripe', stripeRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 5002 });
const supabase = require('./db')

wss.on('connection', (ws) => {
    console.log('📡 Client connected via WebSocket');

    ws.on('message', async (message) => {
        const data = JSON.parse(message);

        console.log(' Received:', data.type);
        console.log(data)
        if (!data.name || !data.type) {
            ws.send(JSON.stringify({ error: "Missing required data fields!" }));
            return;
        }

        if (data.type ==  "Booking request" ){
            try {
                const { error } = await supabase
                    .from('lessons')  
                    .insert([{
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        address: data.address,
                        instrument: data.instrument,
                        duration: data.duration,
                        day: data.day,
                        time: data.time,
                        status: "Pending",
                    }])
                    .select(); //to confirm success
        
                if (error) {
                    console.error("Supabase Insert Error:", error);
                    ws.send(JSON.stringify({ error: "Failed to store booking in database." }));
                    return;
                }        
                //Send confirmation to the frontend
                const reqData = {
                    type: "Ack Booking request",
                    payload: {
                        id: data.id,
                        name: data.name,
                        day: data.day,
                        time: data.time,
                        email: data.email,
                        phone: data.phone,
                        address: data.address,
                        instrument: data.instrument,
                        duration: data.duration,
                        status: "Pending",
                    }
                }
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(reqData));
                    }
                });                        
            } catch (err) {
                console.error("Unexpected Database Error:", err);
                ws.send(JSON.stringify({ error: "Unexpected error while storing booking." }));
            }
        } else if (data.type == 'Send Invoice') {
            try {
                console.log("Processing invoice")
                const { error } = await supabase 
                .from('payments')
                .update({ 
                    invoice: "true",
                    amount: data.amount,
                    date: data.date, 
                    package: data.packages
                })
                .match({ id: data.id });  
            } catch (err) {
                console.error("Unexpected Database Error:", err);
                ws.send(JSON.stringify({ error: "Unexpected error while storing invoice." }));
            }
            const InvoiceData = {
                type: "Recieve Invoice",
                payload: {
                    name: data.name,
                    amount: data.amount,
                    date: data.date, 
                    package: data.packages
                }
            }
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(InvoiceData));
                }
            });

        } else if (data.type == "Booking confirmation") {
            try {
                const { error } = await supabase 
                    .from('lessons')
                    .update({status: data.status})
                    .match({
                        name: data.name,
                        day: data.day,
                        time: data.time,
                        duration: data.duration
                    });
                    if (data.status == "Confirmed") {
                        try {
                            const { error } = await supabase
                            .from('payments')  
                            .insert([{
                                name: data.name,
                                day: data.day,
                                time: data.time,
                                paymentStatus: "unpaid",
                                invoice: false,
                            }])
                            .select(); //to confirm success
                            if (error) {
                                console.error("Supabase insert error:", error);
                              }
                        } catch (err) {
                            console.error(err);
                            console.log("error inserting into payments table in the DB")
                        }
                    } else if (data.status == "Declined") {
                        try {
                            // Check if the payment exists before deleting
                            const { data: paymentExists, error: checkError } = await supabase
                                .from('payments')
                                .select('*')
                                .match({
                                    name: data.name,
                                    day: data.day,
                                    time: data.time
                                });
            
                            if (checkError) {
                                throw new Error(checkError.message);
                            }
            
                            if (paymentExists && paymentExists.length > 0) {
                                // Delete the payment record
                                const { error: deleteError } = await supabase
                                    .from('payments')
                                    .delete()
                                    .match({
                                        name: data.name,
                                        day: data.day,
                                        time: data.time
                                    });
            
                                if (deleteError) {
                                    throw new Error(deleteError.message);
                                } else {
                                    console.log(`Deleted payment record for ${data.name} on ${data.day} at ${data.time}`);
                                }
                            } else {
                                console.log(`No payment record found for ${data.name} on ${data.day} at ${data.time}`);
                            }
                        } catch (err) {
                            console.error("Error deleting payment record:", err);
                        }
                    }
                if (error) {
                    console.error("supabase update error: ", error);
                    ws.send(JSON.stringify({error: "failed to update status in database"}));
                    return;
                };        
                  const bookingData = {
                    type: "Booking result",
                    payload: {
                        id: data.id,
                        name: data.name,
                        day: data.day,
                        time: data.time,
                        status: data.status
                    }
                }
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(bookingData));
                    }
                });  
            } catch (err) {
                console.error("database error: ", err);
                ws.send(JSON.stringify({error: "Unexpected error while updating booking status"}))
            }
        } 
        ws.send(JSON.stringify({ message: "all is well" }));
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
