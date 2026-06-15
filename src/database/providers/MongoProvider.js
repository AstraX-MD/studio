/**
 * @fileOverview MongoDB provider using Mongoose for enterprise data persistence.
 */
import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
  collectionName: { type: String, required: true },
  key: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

Schema.index({ collectionName: 1, key: 1 }, { unique: true });

const Model = mongoose.model('AstraData', Schema);

export default class MongoProvider {
  constructor(bot) {
    this.bot = bot;
  }

  async init() {
    const url = process.env.MONGODB_URL;
    if (!url) throw new Error('MONGODB_URL not found.');
    
    await mongoose.connect(url);
    console.log('==> DATABASE: Mode [MONGODB] connected.');
  }

  async get(collection, key) {
    const doc = await Model.findOne({ collectionName: collection, key });
    return doc ? doc.data : null;
  }

  async set(collection, key, value) {
    await Model.findOneAndUpdate(
      { collectionName: collection, key },
      { data: value },
      { upsert: true, new: true }
    );
  }

  async delete(collection, key) {
    await Model.deleteOne({ collectionName: collection, key });
  }

  async has(collection, key) {
    const count = await Model.countDocuments({ collectionName: collection, key });
    return count > 0;
  }

  async all(collection) {
    const docs = await Model.find({ collectionName: collection });
    const results = {};
    docs.forEach(d => results[d.key] = d.data);
    return results;
  }
}
