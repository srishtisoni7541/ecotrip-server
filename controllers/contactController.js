const asyncHandler = require('express-async-handler');
const { sendEmail } = require('../utils/emailService');

// @desc    Send contact email
// @route   POST /api/contact
// @access  Public
const sendContactEmail = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Please provide name, email and message');
  }
  
  // Format the message
  const emailContent = `
    Contact Form Submission
    
    From: ${name}
    Email: ${email}
    Subject: ${subject || 'Contact Form Inquiry'}
    
    Message:
    ${message}
  `;
  
  try {
    await sendEmail({
      email: process.env.EMAIL_FROM,
      subject: `EcoTriip Contact: ${subject || 'New Inquiry'}`,
      message: emailContent,
      replyTo: email
    });
    
    // Send auto-reply to user
    await sendEmail({
      email,
      subject: 'Thank you for contacting EcoTriip',
      message: `
        Dear ${name},
        
        Thank you for contacting EcoTriip. We have received your message and will get back to you as soon as possible.
        
        Your message:
        "${message}"
        
        Best regards,
        The EcoTriip Team
      `
    });
    
    res.status(200).json({
      success: true,
      message: 'Email sent'
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Get about us content
// @route   GET /api/contact/about
// @access  Public
const getAboutContent = asyncHandler(async (req, res) => {
  // This would typically come from a database,
  // but for simplicity we'll return static content
  const aboutContent = {
    mission: "At EcoTriip, we believe in responsible wildlife tourism that contributes to conservation efforts while providing unforgettable experiences. Our mission is to connect adventure-seekers with the natural world in a sustainable and educational way.",
    vision: "To become the world's leading eco-friendly wildlife safari provider, known for exceptional experiences that benefit both travelers and the ecosystems they visit.",
    values: [
      "Conservation: We allocate a portion of all tour proceeds to local conservation initiatives.",
      "Education: Our experienced guides provide in-depth knowledge about wildlife and ecosystems.",
      "Sustainability: All our tours follow strict sustainability guidelines to minimize environmental impact.",
      "Community: We work closely with local communities, ensuring they benefit from tourism activities."
    ],
    team: [
      {
        name: "Raj Sharma",
        position: "Founder & CEO",
        bio: "Raj, a wildlife conservationist with 15 years of experience, founded EcoTriip to promote responsible tourism.",
        image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
      },
      {
        name: "Sarah Johnson",
        position: "Head of African Expeditions",
        bio: "With a Ph.D. in Wildlife Biology, Sarah designs our African safari experiences with conservation in mind.",
        image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg"
      },
      {
        name: "Aditya Patel",
        position: "Head of Indian Expeditions",
        bio: "A former national park ranger, Aditya brings unparalleled knowledge of Indian wildlife to our tours.",
        image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg"
      }
    ],
    history: "Founded in 2018, EcoTriip started with a simple idea: to create wildlife experiences that benefit both travelers and nature. From our first tiger safari in Ranthambore, India, we've grown to offer expeditions across two continents while maintaining our commitment to sustainability."
  };
  
  res.status(200).json({
    success: true,
    data: aboutContent
  });
});

// @desc    Get contact information
// @route   GET /api/contact/info
// @access  Public
const getContactInfo = asyncHandler(async (req, res) => {
  // This would typically come from a database,
  // but for simplicity we'll return static content
  const contactInfo = {
    email: "info@ecotrip.com",
    phone: "+91 98765 43210",
    address: "123 Wildlife Way, Bengaluru, Karnataka, India - 560001",
    social: {
      facebook: "https://facebook.com/ecotrip",
      instagram: "https://instagram.com/ecotrip",
      twitter: "https://twitter.com/ecotrip"
    },
    officeHours: "Monday to Friday, 9 AM to 6 PM IST"
  };
  
  res.status(200).json({
    success: true,
    data: contactInfo
  });
});

module.exports = {
  sendContactEmail,
  getAboutContent,
  getContactInfo
};