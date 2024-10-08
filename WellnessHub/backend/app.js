// server.js
import express from "express";
import mailjet from "node-mailjet";
import bodyParser from "body-parser";
import fs from "fs";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const apiKey = process.env.API_KEY; // Use env variable for API key
const apiSecret = process.env.API_SECRET_KEY; // Use env variable for API secret

// Initialize Mailjet client using env variables
const mailjetClient = mailjet.apiConnect(apiKey, apiSecret);

// handle file upload with multer
const upload = multer({ dest: "uploads/" });

// Define the email sending route
app.post("/send-email", upload.single("attachment"), async (req, res) => {
  try {
    const recipientEmail = req.body.recipientEmail;
    const subject = req.body.subject;
    const message = req.body.message;
    const attachment = req.file;
    console.log("test1");
    console.log("em: " + recipientEmail);
    console.log("sub: " + subject);
    console.log("msg: " + message);
    console.log("att: " + attachment.originalname);

    const fileContent = fs.readFileSync(attachment.path);
    console.log("test2");

    const request = mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.SENDER_EMAIL,
            Name: process.env.SENDER_NAME,
          },
          To: [
            {
              Email: recipientEmail,
              Name: "User",
            },
          ],
          Subject: subject,
          TextPart: message,
          Attachments: [
            {
              ContentType: "text/plain",
              Filename: "test.txt",
              Base64Content: fileContent.toString("base64"),
            },
          ],
        },
      ],
    });

    const response = await request;
    res.status(200).json({ status: "success", data: response.body });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});