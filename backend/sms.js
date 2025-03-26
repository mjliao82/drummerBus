require("dotenv").config({ path: "./backend/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const supabase = require("./db");
const { DateTime } = require("luxon");

// Ensure required environment variables are present
if (
  !process.env.TWILIO_ACCOUNT_SID ||
  !process.env.TWILIO_AUTH_TOKEN ||
  !process.env.TWILIO_PHONE_NUMBER
) {
  console.error(
    "Missing required environment variables. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in your .env file."
  );
  process.exit(1);
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const router = express.Router();

// Use bodyParser to parse form-encoded POST requests (from Twilio)
router.use(bodyParser.urlencoded({ extended: false }));

// Incoming SMS handler – sends an outbound SMS reply using client.messages.create
router.post("/", async (req, res) => {
  try {
    // Validate incoming request data
    if (!req.body || !req.body.Body || !req.body.From || !req.body.To) {
      console.error("Incoming SMS missing required parameters:", req.body);
      return res.status(400).send("Missing required parameters.");
    }

    const incomingMsg = req.body.Body;
    const fromNumber = req.body.From;
    const toNumber = req.body.To; // This should match process.env.TWILIO_PHONE_NUMBER
    console.log(`Received SMS from ${fromNumber}: "${incomingMsg}"`);

    // Handle unsubscribe request ("STOP")
    if (incomingMsg.trim().toUpperCase() === "STOP") {
      console.log(`Processing unsubscribe request from ${fromNumber}.`);
      try {
        const message = await client.messages.create({
          body: "You have been unsubscribed from notifications.",
          from: toNumber,
          to: fromNumber,
        });
        console.log(
          `Unsubscribe confirmation sent to ${fromNumber}. Message SID: ${message.sid}`
        );
        return res.status(200).send("Unsubscribed and confirmation message sent.");
      } catch (err) {
        console.error("Error sending unsubscribe confirmation:", err);
        return res.status(500).send("Failed to send unsubscribe confirmation.");
      }
    }

    // For all other incoming messages, send an acknowledgement reply
    try {
      const message = await client.messages.create({
        body: "Your message has been received.",
        from: toNumber,
        to: fromNumber,
      });
      console.log(
        `Acknowledgement sent to ${fromNumber}. Message SID: ${message.sid}`
      );
      return res.status(200).send("Message processed and acknowledgement sent.");
    } catch (err) {
      console.error("Error sending acknowledgement:", err);
      return res.status(500).send("Failed to process message.");
    }
  } catch (err) {
    console.error("Unexpected error in incoming SMS handler:", err);
    res.status(500).send("Internal server error.");
  }
});

/**
 * sendNotification is a reusable function to send an SMS via Twilio.
 * @param {string} to - Recipient phone number (E.164 format, e.g. "+15854305010").
 * @param {string} message - Message content.
 */
async function sendNotification(to, message) {
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log(
      `Notification sent to ${to}: "${message}". Message SID: ${response.sid}`
    );
    return response;
  } catch (error) {
    console.error(`Failed to send notification to ${to}:`, error);
    throw error;
  }
}

/**
 * In-memory set to track which lesson occurrences have been notified.
 * Each key is a string in the format: "<lesson_id>-<occurrence ISO date>".
 */
const sentReminders = new Set();

/**
 * Mapping of day names to Luxon weekday numbers (Monday=1, …, Sunday=7).
 */
const dayMapping = {
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
  sunday: 7,
};

/**
 * checkAndSendLessonReminders queries the lessons table and, for each lesson,
 * calculates the next occurrence (weekly) based on the lesson's day and time.
 * If the current time is approximately one hour (±1 minute tolerance) before
 * the lesson start, a reminder SMS is sent.
 */
async function checkAndSendLessonReminders() {
  console.log("Starting lesson reminder check...");
  try {
    const { data: lessons, error } = await supabase.from("lessons").select("*");
    if (error) {
      console.error("Error fetching lessons from database:", error);
      return;
    }
    if (!lessons || lessons.length === 0) {
      console.log("No lessons found in database for reminders.");
      return;
    }
    console.log(`Fetched ${lessons.length} lesson(s) from database.`);
    const now = DateTime.local();

    // Iterate using a for-of loop to properly handle asynchronous operations
    for (const lesson of lessons) {
      try {
        if (!lesson.day || !lesson.time) {
          console.warn(`Lesson id ${lesson.id} is missing day or time information.`);
          continue;
        }
        const lessonDay = lesson.day.toLowerCase();
        const targetWeekday = dayMapping[lessonDay];
        if (!targetWeekday) {
          console.error(`Invalid lesson day "${lesson.day}" for lesson id ${lesson.id}`);
          continue;
        }

        // Parse the lesson time (expected format "HH:mm", e.g., "10:00")
        const timeParts = lesson.time.split(":");
        if (timeParts.length < 1) {
          console.error(`Invalid lesson time format "${lesson.time}" for lesson id ${lesson.id}`);
          continue;
        }
        const lessonHour = parseInt(timeParts[0], 10);
        const lessonMinute = timeParts.length > 1 ? parseInt(timeParts[1], 10) : 0;

        // Calculate days difference between now and the lesson's target weekday.
        const diffDays = (targetWeekday - now.weekday + 7) % 7;
        // Create the DateTime for the next occurrence.
        let nextOccurrence = now.plus({ days: diffDays }).set({
          hour: lessonHour,
          minute: lessonMinute,
          second: 0,
          millisecond: 0,
        });

        // If today's occurrence has already passed, schedule for next week.
        if (nextOccurrence < now) {
          nextOccurrence = nextOccurrence.plus({ days: 7 });
        }

        // Determine the difference in minutes between now and the next occurrence.
        const diffMinutes = nextOccurrence.diff(now, "minutes").minutes;
        console.log(
          `Lesson id ${lesson.id}: Next occurrence at ${nextOccurrence.toISO()} (in ${diffMinutes.toFixed(
            2
          )} minutes)`
        );

        // If it's about one hour away (with a tolerance of ±1 minute)...
        if (diffMinutes >= 59 && diffMinutes <= 61) {
          // Create a unique key for this lesson occurrence.
          const occurrenceKey = `${lesson.id}-${nextOccurrence.toISODate()}`;

          // Skip if reminder already sent for this occurrence.
          if (sentReminders.has(occurrenceKey)) {
            console.log(`Reminder already sent for lesson id ${lesson.id} on ${nextOccurrence.toISODate()}.`);
            continue;
          }

          // Ensure the lesson has a phone number.
          if (!lesson.phone) {
            console.error(`No phone number found for lesson id ${lesson.id}. Reminder not sent.`);
            continue;
          }

          const reminderMessage = `Reminder: Your ${lesson.instrument} lesson is scheduled at ${lesson.time} on ${lesson.day}.`;
          try {
            await sendNotification(lesson.phone, reminderMessage);
            console.log(
              `Sent reminder for lesson id ${lesson.id} (occurring on ${nextOccurrence.toISODate()}).`
            );
            sentReminders.add(occurrenceKey);
          } catch (err) {
            console.error(`Error sending reminder for lesson id ${lesson.id}:`, err);
          }
        }
      } catch (innerErr) {
        console.error(`Error processing lesson id ${lesson.id}:`, innerErr);
      }
    }
  } catch (err) {
    console.error("Unexpected error in checkAndSendLessonReminders:", err);
  }
}

// Schedule the lesson reminder check to run every minute.
setInterval(checkAndSendLessonReminders, 60000);

module.exports = { router, sendNotification };
