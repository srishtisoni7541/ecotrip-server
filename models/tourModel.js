  const mongoose = require('mongoose');

  const tourSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, 'Tour name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Tour name cannot be more than 100 characters']
      },
      tagline: {
        type: String,
        required: [true, 'Tagline is required'],
        trim: true,
        maxlength: [200, 'Tagline cannot be more than 200 characters']
      },
      description: {
        type: String,
        required: [true, 'Description is required']
      },
      price: {
        type: Number,
        required: [true, 'Price is required']
      },
      discountedPrice: {
        type: Number,
        validate: {
          validator: function(val) {
            // discountedPrice should be less than regular price
            return val < this.price;
          },
          message: 'Discounted price ({VALUE}) should be below regular price'
        }
      },
      duration: {
        type: Number,
        required: [true, 'Tour duration is required']
      },
      startDate: {
        type: Date,
        required: [true, 'Start date is required']
      },
      endDate: {
        type: Date,
        required: [true, 'End date is required']
      },
      maxGroupSize: {
        type: Number,
        required: [true, 'Group size is required']
      },
      destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: [true, 'Destination is required']
      },
      difficulty: {
        type: String,
        enum: {
          values: ['easy', 'medium', 'difficult'],
          message: 'Difficulty must be either: easy, medium, difficult'
        },
        default: 'medium'
      },
      images: [String],
      featured: {
        type: Boolean,
        default: false
      },
      activities: [String],
      includedServices: [String],
      excludedServices: [String],
      itinerary: [
        {
          day: {
            type: Number,
            required: true
          },
          title: {
            type: String,
            required: true
          },
          description: {
            type: String,
            required: true
          },
          accommodationType: String,
          meals: [String]
        }
      ],
      ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be at least 1.0'],
        max: [5, 'Rating cannot be more than 5.0'],
        set: val => Math.round(val * 10) / 10 // Round to 1 decimal place
      },
      ratingsQuantity: {
        type: Number,
        default: 0
      }
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    }
  );

  // Virtual property for tour slug
  tourSchema.virtual('slug').get(function() {
    return this.name.toLowerCase().replace(/\s+/g, '-');
  });

  // Virtual populate for reviews
  tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
  });

  // Index for efficient searching
  tourSchema.index({ price: 1, ratingsAverage: -1 });
  tourSchema.index({ startDate: 1 });
  tourSchema.index({ featured: 1 });

  module.exports = mongoose.model('Tour', tourSchema);