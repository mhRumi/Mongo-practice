const mongoose = require('mongoose');
const memberSchema = new mongoose.Schema({
    reg_no: {
      type: Number,
      unique: true,
    },
    username: String,
    password: String,
    email: String,
    birth_date: Date,
    pro_pic:{
      type: String,
      default: '/public/users/man.png'
    } ,
    phone: String,
    batch: String,
    skills: String,
    facebook: String,
    linkedin: String,
    github: String,
    isgraduated: {
      type: Boolean,
      default: false
    },
    isMailVarified:{
      type: Boolean,
      default: false
    },
    isApproved:{
      type: Boolean,
      default: false
    },
    isAlumni: {
      type: Boolean,
      default: false
    },
    created_on: Date,
    last_login: Date
  });
  
  const Member = mongoose.model('Member', memberSchema);

  module.exports = Member;