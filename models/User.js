const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  googleID: String,
  surname: String,
  firstNames: String,
});

mongoose.model('users', userSchema);
