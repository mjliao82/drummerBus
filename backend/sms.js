require("dotenv").config({ path: "./backend/.env" });
const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const supabase = require("./db");
const { DateTime } = require("luxon");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const router = express.Router();

// Use bodyParser to parse form-encoded POST requests (from Twilio)
router.use(bodyParser.urlencoded({ extended: false }));

// Incoming SMS handler – handles unsubscribe requests like "STOP"
router.post("/", async (req, res) => {
  const incomingMsg = req.body.Body;
  const fromNumber = req.body.From;
  console.log(`Received SMS from ${fromNumber}: ${incomingMsg}`);

  if (incomingMsg && incomingMsg.trim().toUpperCase() === "STOP") {
    console.log(`Unsubscribing ${fromNumber} from notifications.`);
    // OPTIONAL: Update your DB to mark this phone number as unsubscribed.
    res.type("text/xml");
    return res.send(
      `<Response><Message>You have been unsubscribed from notifications.</Message></Response>`
    );
  }

  // Acknowledge any other incoming message.
  res.type("text/xml");
  res.send(
    `<Response><Message>Your message has been received.</Message></Response>`
  );
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
      from: process.env.TWILIO_PHONE_NUMBER, // Updated environment variable name
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
  try {
    const { data: lessons, error } = await supabase.from("lessons").select("*");
    if (error) {
      console.error("Error fetching lessons for reminders:", error);
      return;
    }

    const now = DateTime.local();

    lessons.forEach(async (lesson) => {
      // Ensure the lesson has a valid day.
      const lessonDay = lesson.day.toLowerCase();
      const targetWeekday = dayMapping[lessonDay];
      if (!targetWeekday) {
        console.error(`Invalid lesson day "${lesson.day}" for lesson id ${lesson.id}`);
        return;
      }

      // Parse the lesson time (expected format "HH:mm", e.g., "10:00").
      const timeParts = lesson.time.split(":");
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

      // If the occurrence today has already passed, schedule for next week.
      if (nextOccurrence < now) {
        nextOccurrence = nextOccurrence.plus({ days: 7 });
      }

      // Determine the difference in minutes between the next occurrence and now.
      const diffMinutes = nextOccurrence.diff(now, "minutes").minutes;

      // If it's about one hour away (with a tolerance of ±1 minute)...
      if (diffMinutes >= 59 && diffMinutes <= 61) {
        // Create a unique key for this lesson occurrence.
        const occurrenceKey = `${lesson.id}-${nextOccurrence.toISODate()}`;

        // Avoid sending duplicate reminders for the same occurrence.
        if (sentReminders.has(occurrenceKey)) return;

        // Construct the reminder message.
        const message = `Reminder: Your ${lesson.instrument} lesson is scheduled at ${lesson.time} on ${lesson.day}.`;

        // Check for a phone number. It should be stored in E.164 format (e.g., +15854305010).
        if (!lesson.phone) {
          console.error(`No phone number found for lesson id ${lesson.id}. Reminder not sent.`);
          return;
        }

        try {
          await sendNotification(lesson.phone, message);
          console.log(
            `Sent reminder for lesson id ${lesson.id} (occurring on ${nextOccurrence.toISODate()}).`
          );
          sentReminders.add(occurrenceKey);
        } catch (err) {
          console.error(`Error sending reminder for lesson id ${lesson.id}:`, err);
        }
      }
    });
  } catch (err) {
    console.error("Unexpected error in checkAndSendLessonReminders:", err);
  }
}

// Schedule the lesson reminder check to run every minute.
setInterval(checkAndSendLessonReminders, 60000);

module.exports = { router, sendNotification };
