require("dotenv").config({ path: "./backend/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const supabase = require('./db');
const { DateTime } = require('luxon');

const client = twilio(
    //pulling these fields from .env file, twilio number is there as well
    //if the the number doesn't work pulling from .env, you can hardcode that part in the 'from' variable 
    // do not hardcode the ACCOUNT SID and AUTH TOEKN, it that gets hacked, we're cooked.
  process.env.TWILIO_ACCOUNT_SID, 
  process.env.TWILIO_AUTH_TOKEN
);

const router = express.Router();

// do router.post to handle any incoming msgs 

// send reminder 

//send notification/verification


module.exports = {router, sendNotification};
// sendNotification is a function yet to be build
// it needs to be exported because it needs to be callable from other files.
// it needs to be called when client account is approved by Anthony, the client gets notified.
// don't worry about where to call it, that will be Michael's job. 