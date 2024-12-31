const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Express on Vercel 123"));

// Route to handle form submissions
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  // Create a transporter object
  let transporter = nodemailer.createTransport({
    secure: true,
    service: "gmail", // Replace with your email provider
    port: process.env.EMAIL_PORT,
    host: process.env.SMTP_HOST,
    auth: {
      user: process.env.SENDER_EMAIL, // Your email address
      pass: process.env.SENDER_PW, // Your email password or app password
    },
    tls: {
      rejectUnauthorized: false, // Ignore self-signed certificate errors
    },
  });

  // Set up email data
  let mailOptions = {
    from: email, // Sender's email
    to: process.env.RECEIVER_EMAIL, // Replace with the recipient's email
    subject: `New message from ${name}`,
    text: `You have received a new message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  // Send email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    res
      .status(200)
      .send({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).send({ success: false, message: "Error sending email." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
