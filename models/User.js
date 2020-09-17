const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    lieblingsMensen: [{ type: Schema.Types.ObjectId, ref: 'Mensa' }],
    lieblingsSpeisen: []
});

const User = mongoose.model('User', UserSchema);

module.exports = User;