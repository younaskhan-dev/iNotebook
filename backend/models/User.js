const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
        email:{
        type:String,
        required:true,
        unique: true
    },
        password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        default: ""
    },
    Date:{
        type:Date,
        default:Date.now
    }
  },
  { collection: 'users' }
);
const User = mongoose.model('User', UserSchema);
module.exports = User;