require('dotenv').config(); // Load environment variables
const sendEmail = require('./email'); // Import your email module

// Test email
sendEmail(
    'rchen72@buffalo.edu',  // Change this to the recipient's email
    'Test Email',
    'Hello!\n This is a test email for IQVentory' // Change message if needed
)
.then(response => console.log(response))
.catch(error => console.error(error));
