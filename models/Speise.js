const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SpeiseSchema = new Schema({
    id: Number,
    name: String,
    category: String,
    price: {
      students: Number,
      employees: Number,
      others: Number
    },
    notes: [],
    fans: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  });

  module.exports = mongoose.model("Speise", SpeiseSchema);