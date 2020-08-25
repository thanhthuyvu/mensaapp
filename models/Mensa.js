const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MensaSchema = new Schema({
    id: Number,
    name: String, 
    city: String, 
    address: String,
    coordinates: [], 
    istMeinLiebling: {type: Boolean, default: false}
  });

  module.exports = mongoose.model("Mensa", MensaSchema);