const mongoose = require('mongoose');
// const validator = require('validator');

const userschema = new mongoose.Schema({
    username:{
        type:String , 
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    }
})

const Register = new mongoose.model("Register" , userschema);

module.exports = Register;