const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema({
  Product: {
    type: String,
    required: true,
  },
  Lider: {
    type: String,
    required: true,
  },
  Jumbo: {
    type: String,
    required: true,
  },
  Best: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Data', DataSchema);
