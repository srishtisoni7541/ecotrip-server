# EcoTriip API - Wildlife Safari Travel Platform

A robust backend API for EcoTriip, a travel platform specializing in jungle safari tours in India and Africa.

## Features

- RESTful API endpoints for tours, destinations, and testimonials
- User authentication & authorization with JWT
- Role-based access control (user/admin)
- File uploads for testimonials and tour images using Cloudinary
- Email notifications with Nodemailer
- MongoDB database with Mongoose ODM

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **Multer & Cloudinary** - File uploads
- **Nodemailer** - Email notifications
- **Express Validator** - Input validation

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `GET /api/auth/me` - Get current user

### Public Routes
- `GET /api/tours` - Get all tours
- `GET /api/tours/featured` - Get featured tours
- `GET /api/tours/:id` - Get a single tour
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/region/:region` - Get destinations by region (Indian/African Wildlife)
- `GET /api/destinations/:id` - Get a single destination
- `GET /api/testimonials` - Get all approved testimonials
- `GET /api/testimonials/featured` - Get featured testimonials
- `GET /api/testimonials/:id` - Get a single testimonial
- `GET /api/contact/about` - Get about us content
- `GET /api/contact/info` - Get contact information
- `POST /api/contact` - Send contact email

### Authenticated User Routes
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create a booking
- `GET /api/bookings/:id` - Get a single booking
- `PUT /api/bookings/:id/cancel` - Cancel a booking
- `POST /api/testimonials` - Create a testimonial
- `PUT /api/testimonials/:id` - Update user's testimonial
- `DELETE /api/testimonials/:id` - Delete user's testimonial
- `POST /api/testimonials/:id/media` - Upload testimonial media

### Admin Routes
- `POST /api/tours` - Create a tour
- `PUT /api/tours/:id` - Update a tour
- `DELETE /api/tours/:id` - Delete a tour
- `POST /api/tours/:id/images` - Upload tour images
- `POST /api/destinations` - Create a destination
- `PUT /api/destinations/:id` - Update a destination
- `DELETE /api/destinations/:id` - Delete a destination
- `POST /api/destinations/:id/images` - Upload destination images
- `PUT /api/testimonials/:id/approve` - Approve/reject testimonial
- `GET /api/bookings/admin/all` - Get all bookings
- `PUT /api/bookings/:id` - Update booking details/status

## Set Up and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Start the server: `npm run dev`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecotrip
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@ecotrip.com
```

## License

MIT"# ecotriip" 
