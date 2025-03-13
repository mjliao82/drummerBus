import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  // change /webhook to actual webhook url when created
  const event = req.body;

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const transactionId = event.resource.id;
    const amount = event.resource.amount.value;
    const payerEmail = event.resource.payer.email_address;

    // success message for frontend, uses socket for now, change later probablyyy
    io.emit("payment_success", { amount, payerEmail });

    // Split 5% of payment for another recipient
    const accessToken = await getAccessToken();
    if (accessToken) {
      await sendPayout(accessToken, "mjliao82@gmail.com", amount * 0.05); // 5% transfer to another PayPal account
    }

    return res.status(200).json({ status: "success" });
  }

  return res.status(400).json({ status: "ignored" });
});

// Function to get the PayPal Access Token
const getAccessToken = async (): Promise<string | null> => {
  const clientId =
    "AZHwUoMN6do-F0p7trX9c-hCS1j-WU5XHAW3ITY0cjjgmWqKVYIUuA7_jRUnKKHj-gN0qAYnT6E__woO";
  const clientSecret =
    "EHyAJwE7CLpaAyTSEXCNAQlTa683GVCFwwijQ2hCl_NEOrliyeG5XCEEYRnjI19JheGXimY-sajC4lcm";

  try {
    // Get access token from PayPal
    const response = await axios.post(
      "https://api.sandbox.paypal.com/v1/oauth2/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: clientId,
          password: clientSecret,
        },
      }
    );

    // Return the access token
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

// Function to send the payout
const sendPayout = async (
  accessToken: string,
  recipientEmail: string,
  amount: number
) => {
  const batchId = uuidv4();
  const senderItemId = uuidv4();

  const payoutData = {
    sender_batch_header: {
      email_subject: "You’ve received a payout!",
      recipient_type: "EMAIL",
      sender_batch_id: batchId,
    },
    items: [
      {
        recipient_wallet: "PAYOUT",
        amount: { value: amount, currency: "USD" },
        receiver: recipientEmail,
        note: "Payment split - 5%",
        sender_item_id: senderItemId,
      },
    ],
  };

  try {
    const response = await axios.post(
      "https://api.sandbox.paypal.com/v1/payments/payouts",
      payoutData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Payout sent:", response.data);
  } catch (error) {
    console.error("Error sending payout:", error);
  }
};

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
