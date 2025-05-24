const nodemailer = require('nodemailer');

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {String} options.email - Recipient email
 * @param {String} options.subject - Email subject
 * @param {String} options.message - Email message
 * @param {String} [options.replyTo] - Reply-to email address
 * @returns {Promise} - Resolved when email is sent
 */
const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Set reply-to if provided
  if (options.replyTo) {
    mailOptions.replyTo = options.replyTo;
  }

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };