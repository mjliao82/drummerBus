require('dotenv').config(); // Load environment variables
const sendEmail = require('./email'); // Import your email module

// Test email
sendEmail(
    'Anthony@lidrumbus.com',  // Change this to the recipient's email
    'Test Email',
    'Hello Anthony!\n This is a test email from IQVentory' // Change message if needed
)
.then(response => console.log(response))
.catch(error => console.error(error));
