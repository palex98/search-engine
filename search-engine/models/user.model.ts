const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    userId: Number,
    name: String,
    dateTime: String,
});

export const User = mongoose.model('User', userSchema);