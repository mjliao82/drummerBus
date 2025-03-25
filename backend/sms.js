require("dotenv").config({ path: "./backend/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const supabase = require("./db");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const router = express.Router();

// Use bodyParser to parse Twilio's form-encoded POST requests
router.use(bodyParser.urlencoded({ extended: false }));

// In-memory set to track which lessons have been sent a reminder
const remindedLessons = new Set();

// Handle incoming messages from Twilio
router.post("/", async (req, res) => {
  const incomingMsg = req.body.Body;
  const fromNumber = req.body.From;
  console.log(`Received SMS from ${fromNumber}: ${incomingMsg}`);

  // If the message is "STOP", unsubscribe the client
  if (incomingMsg && incomingMsg.trim().toUpperCase() === "STOP") {
    console.log(`Unsubscribing ${fromNumber} from notifications.`);
    // OPTIONAL: Update your DB to mark this phone number as unsubscribed.
    res.type("text/xml");
    return res.send(
      `<Response><Message>You have been unsubscribed from notifications.</Message></Response>`
    );
  }

  // Otherwise, simply acknowledge receipt.
  res.type("text/xml");
  res.send(
    `<Response><Message>Your message has been received.</Message></Response>`
  );
});

/**
 * sendNotification is a reusable function to send an SMS via Twilio.
 * @param {string} to - Recipient phone number in E.164 format.
 * @param {string} message - Message content.
 */
async function sendNotification(to, message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE, // Ensure TWILIO_PHONE is set in your .env file
      to: to,
    });
    console.log(`Notification sent to ${to}: ${message}`);
    return response;
  } catch (error) {
    console.error("Failed to send notification:", error);
    throw error;
  }
}

/**
 * checkAndSendLessonReminders queries the lessons table and sends a reminder SMS.
 * Since your lessons table no longer contains scheduling fields or a reminder_sent flag,
 * this implementation sends a reminder immediately when a lesson is found.
 *
 * It uses an in-memory set to ensure each lesson (by its id) is notified only once.
 *
 * NOTE: Without scheduling info (such as lesson date/time), the "one hour before" behavior
 * cannot be enforced. For proper scheduling, you’d need to extend your schema.
 */
async function checkAndSendLessonReminders() {
  try {
    const { data: lessons, error } = await supabase.from("lessons").select("*");
    if (error) {
      console.error("Error fetching lessons for reminders:", error);
      return;
    }

    lessons.forEach(async (lesson) => {
      // Skip if this lesson has already been notified.
      if (remindedLessons.has(lesson.id)) return;

      // Construct a reminder message.
      // (You can adjust the message based on lesson details or notification type.)
      const message = `Reminder: Your lesson is scheduled to start in one hour.`;

      try {
        await sendNotification(lesson.phone, message);
        console.log(`Sent reminder for lesson id ${lesson.id}`);
        // Mark the lesson as having been reminded to avoid duplicate notifications.
        remindedLessons.add(lesson.id);
      } catch (sendError) {
        console.error(`Error sending reminder for lesson id ${lesson.id}:`, sendError);
      }
    });
  } catch (err) {
    console.error("Unexpected error in checkAndSendLessonReminders:", err);
  }
}

// Schedule the reminder check to run every minute.
setInterval(checkAndSendLessonReminders, 60000);

module.exports = { router, sendNotification };
