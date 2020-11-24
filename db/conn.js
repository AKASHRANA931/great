const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://akash:akash@cluster0.a4xk7.mongodb.net/userapi",{
    useCreateIndex:true ,
    useNewUrlParser:true , 
    useFindAndModify:true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection is successfully");
}).catch((e)=>{
    console.log("No Connection");
})