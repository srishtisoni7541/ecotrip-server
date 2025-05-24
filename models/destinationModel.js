const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    region: {
      type: String,
      enum: ['Indian Wildlife', 'African Wildlife'],
      required: [true, 'Region is required']
    },
    images: [String],
    location: {
      country: {
        type: String,
        required: [true, 'Country is required']
      },
      state: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    bestTimeToVisit: String,
    visaRequirements: String,
    weatherInfo: String,
    featuredWildlife: [String]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual populate for tours
destinationSchema.virtual('tours', {
  ref: 'Tour',
  foreignField: 'destination',
  localField: '_id'
});

// Index for efficient querying
destinationSchema.index({ region: 1 });

module.exports = mongoose.model('Destination', destinationSchema);