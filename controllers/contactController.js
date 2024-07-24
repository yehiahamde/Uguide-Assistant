const nodemailer = require('nodemailer');
const Contact = require('../models/contact');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kareem.mohamedd18@gmail.com',
        pass: 'mjux lzhg pkwd dmvy'
    }
});

const sendContactMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        console.log('Received contact form submission:');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Message:', message);

        // Save the contact message to the database
        const newContactMessage = new Contact({ name, email, message });
        await newContactMessage.save();

        await transporter.sendMail({
            from: 'kareem.mohamedd18@gmail.com',
            to: email,
            subject: 'New Contact Form Submission',
            text: `Hello ${name}, \n\nThis is a confirmation that we've received your message successfully. \n\nThis message was submitted by email address: ${email}\n\nMessage content: ${message} \n\nSomeone from our team will get back to you within 48 working hours. \n\nThanks, \n\nU Guide Team.`
        });

        res.status(200).json({ message: "Message received successfully!" });
    } catch (error) {
        console.error('Error processing contact form submission:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { sendContactMessage };
