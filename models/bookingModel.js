const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a Tour']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a User']
    },
    price: {
      type: Number,
      required: [true, 'Booking must have a price']
    },
    numberOfPersons: {
      type: Number,
      required: [true, 'Number of persons is required'],
      min: [1, 'Number of persons must be at least 1']
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required']
    },
    bookingDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    specialRequests: String,
    paid: {
      type: Boolean,
      default: false
    },
    contactDetails: {
      phone: String,
      email: String,
      address: String
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Calculate total amount before save
bookingSchema.pre('save', function(next) {
  this.totalAmount = this.price * this.numberOfPersons;
  next();
});

// Add indexes for common queries
bookingSchema.index({ tour: 1, user: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);