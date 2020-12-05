const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/userapi",{
    useCreateIndex:true ,
    useNewUrlParser:true , 
    useFindAndModify:true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("connection is successfully");
}).catch((e)=>{
    console.log("No Connection");
})