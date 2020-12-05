const mongoose = require('mongoose');
// const validator = require('validator');
// const jwt = require("jsonwebtoken");

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
    // tokens:[{
    //     token:{
    //         type:String,
    //         required:true
    //     }
    // }]
})

//generate tokens

// userschema.methods.generateAuthToken = async function(){
//     try {
//         const token = jwt.sign({_id:this._id} , "comcodeducationbycryptcodeishereforauthentication" );
//         this.token = this.tokens = this.tokens.concat({token});
//         await this.save();
//     } catch (error) {
//         console.log(error);
//     }
// }
const Register = new mongoose.model("Register" , userschema);

module.exports = Register;