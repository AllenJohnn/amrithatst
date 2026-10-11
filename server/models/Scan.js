import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['safe', 'suspicious', 'phishing'],
      default: 'safe',
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      default: 95,
    },
    timestamp: {
      type: String,
      default: 'Just now',
    },
    date: {
      type: String,
    },
    features: {
      urlLength: Number,
      hasIp: Boolean,
      dotsCount: Number,
      hyphensCount: Number,
      hasHttps: Boolean,
      hasSuspiciousWords: Boolean,
      suspiciousWords: [String],
      tldRisk: String,
      subdomainsCount: Number,
    },
    aiExplanation: {
      type: String,
    },
    recommendation: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for id mapping to match frontend
scanSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

scanSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    return ret;
  },
});

const Scan = mongoose.models.Scan || mongoose.model('Scan', scanSchema);

export default Scan;
