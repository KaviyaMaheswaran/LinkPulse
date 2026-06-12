import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  device: {
    type: String,
    default: 'Desktop',
  },
  browser: {
    type: String,
    default: 'Unknown',
  },
  referrer: {
    type: String,
    default: 'Direct',
  },
});

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;
