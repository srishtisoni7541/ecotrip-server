const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Testimonial must belong to a user']
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Testimonial must belong to a tour']
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5
    },
    title: {
      type: String,
      trim: true
    },
    mediaUrl: String, // URL to image or video
    mediaType: {
      type: String,
      enum: ['image', 'video', 'none'],
      default: 'none'
    },
    approved: {
      type: Boolean,
      default: false
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// A user can only write one testimonial per tour
testimonialSchema.index({ tour: 1, user: 1 }, { unique: true });

// Calculate average ratings for tours after saving a testimonial
testimonialSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId, approved: true }
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await mongoose.model('Tour').findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

testimonialSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.tour);
});

module.exports = mongoose.model('Testimonial', testimonialSchema);