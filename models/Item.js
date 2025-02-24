// models/Item.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: Date
});

module.exports = mongoose.model('Item', ItemSchema);
