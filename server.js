const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Import routes
const tourRoutes = require('./routes/tourRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const homeRoutes = require('./routes/homeroute')
const authViewRoutes = require('./routes/authViewRoutes');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// Middleware
// ✅ CORS Configuration
const corsOptions = {
  origin: ['http://localhost:5173','https://ecotrip-client.vercel.app','http://localhost:5174'], 
  credentials: true, 
};
app.use(cors(corsOptions));
app.use(express.json());


// Logging middleware in development
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

app.use(morgan('tiny'));
// Mount routes
app.use('/api/trips', tourRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/auth', authViewRoutes); 

// Root route
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'Welcome to EcoTriip API',
//     version: '1.0.0'
//   });
// });
app.use(express.urlencoded({ extended: true }));

// Error handler
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});