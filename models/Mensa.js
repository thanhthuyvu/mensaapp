const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MensaSchema = new Schema({
    id: Number,
    name: String, 
    city: String, 
    address: String,
    coordinates: [], 
    fans: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  });

  module.exports = mongoose.model("Mensa", MensaSchema);