const express = require("express");
const path = require("path");
const multer = require("multer");
const session = require("express-session");
const hbs = require("hbs");
// const passport = require('passport');
require('./db/conn');
const mailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const {json} = require("express");
const Register = require("./models/userschema");
const Job_Register = require("./models/jobschema");
const { Console } = require("console");
const app = express();

// app.use(passport.initialize());
// app.use(passport.session());

//session
app.use(session({
    secret:'4Sfr2KA$QyGPD8',
    resave:false,
    saveUninitialized:true,
}));

// for save data in database
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//port
const port = process.env.PORT || 5000;

// static file
app.use(express.static(__dirname+'/public/'));
// partial use 

app.set("view engine" , "hbs");

//root directory Public
const partial = path.join(__dirname , "/views/partials");
hbs.registerPartials(partial);

//local storage . use for save temporary data 
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

//middle check login

function checklogin(req , res , next){
    const mytoken = localStorage.getItem('mytoken');
    try {
        if(req.session.userName){
        jwt.verify(mytoken , "comcodeducationbycryptcodeishereforauthentication");
        }
        else{
            res.render("login");
        }
    } catch (err) {
        res.render("login");
    }
    next();
}

const userdata = Register.findOne();
//root page index.hbs(Home page)
app.get("/",(req, res , next)=>{
    const name = req.session.userName;
    if(name){
        res.render("index" , {
        logout:"logout",
        link1:"#", link2:"/UserProfile",
        msg1:name , msg2:"profile"});
    }
    else{
        res.render("index" , {
            link1:"/registration", link2:"/login",
            msg1:"Sign-up" , msg2:"Login"});
        }
});

// courses page
app.get("/courses",checklogin, (req , res )=>{
    const name = req.session.userName;
    userdata.exec(function(err , data){
        if(err) throw err;
        res.render("courses",{
            logout:"logout",
            link1:"#", link2:"/UserProfile",
            msg1:name,
            msg2:"profile",
        });
    });
    
});
// job-portal page 
app.get("/job-portal" ,checklogin,(req , res)=>{
    const name = req.session.userName;
    userdata.exec(function(err , data){
        if(err) throw err;
        res.render("job-portal" , {
            logout:"logout",
            link1:"#", link2:"/UserProfile",
            msg1:name,
            msg2:"profile",
        });
    });
});
// about page

app.get("/about",(req , res)=>{
     const name = req.session.userName;
    if(name){
    res.render("about" ,{
        logout:"logout",
        link1:"#", link2:"/UserProfile",
        msg1:name,
        msg2:"profile",
    })
    }
    else{
        res.render("about" ,{
            link1:"/registration", link2:"/login",
            msg1:"Sign-up" , msg2:"Login"})
    }

});

// contact page
app.get("/contact" , (req , res)=>{
    const name = req.session.userName;
    if(name){
    res.render("contact" ,{
        logout:"logout",
        link1:"#", link2:"/UserProfile",
        msg1:name,
        msg2:"profile",
    })
    }
    else{
        res.render("contact" ,{
            link1:"/registration", link2:"/login",
            msg1:"Sign-up" , msg2:"Login"})
    }
});

// for registration page

app.get("/registration" , (req , res)=>{
    res.render("registration");
});

app.get("/login" , (req , res)=>{
    res.render("login");
})

app.get("/logout" , (req , res)=>{
    localStorage.removeItem("mytoken");
    req.session.destroy(function(err) {
        if(err){
            res.render("index" , {
                link1:"/registration", link2:"/login",
                msg1:"Sign-up" , msg2:"Login"});
        }
      })
    res.render("index" , {
        link1:"/registration", link2:"/login",
        msg1:"Sign-up" , msg2:"Login"});
});


// Temporary Storage

// const Storage = multer.diskStorage({
//     destination:"./public/uploads/",
//     filename:(req , file , cb)=>{
//         cb(file.fieldname+'_'+Date.now()+path.extname(file.originalname));
//     }
//   });

// var upload = multer({ storage:Storage })

// app.post("/add_job",upload.single('file'),(req , res)=>{
//         const image = req.files;
//         const addschema = new Job_Register({
//         logo:image,
//         job_name:req.body.job_name,
//         job_link:req.body.job_link
//         });
//         addschema.save((err , doc)=>{
//             if(err) throw err;
//             res.render("jobadd" , {
//                 message:"job added successfully",
//             })
//         });
// });

// Admin Panel
app.get("/admin_panel" , (req , res)=>{
    res.render("admin_panel");
});

app.post("/check" , (req , res)=>{
    const Admin_email = req.body.Admin_email;
    const Admin_password = req.body.Admin_password;

    if((Admin_email === "akashpundir931@gmail.com" || Admin_email === "amantayal03@gmail.com" || Admin_email === "shahbajakon@gmail.com") && (Admin_password === "comcodteam")){
        res.render("jobadd");
    }
    else{
        res.render("admin_panel" , {
            message:"invalid details",
        });
    }
});

app.post("/registration" , async(req , res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.password2;
        if(password === cpassword){
            const registeruser = new Register({
                username:req.body.username,
                email:req.body.email,
                password:password,
                cpassword:cpassword
            })
            const data = await registeruser.save();
            res.render("login");
            // email sender
            // var transporter = mailer.createTransport({
            //     service:'gmail' , 
            //     auth:{
            //         user:'projectrana08@gmail.com',
            //         pass:'comcodteam'
            //     }
            // });
            
            // var mailOptions = {
            //     from:'projectrana08@gmail.com',
            //     to: req.body.email,
            //     subject: 'Welcome to comcod '+"OTP : 10579",
            //     text:'Hi '+' '+ req.body.username +' '+ 'welcome to comcod' +' '+"Congratulations on being part of the team! The whole team members welcomes you and we look forward to a successful journey with you! Welcome aboard A big congratulations on your new role."
            // };
            // transporter.sendMail(mailOptions , (error , info)=>{
            //     if(error){
            //         console.log(error);
            //     }
            //     else{
            //         console.log('Email send' +info.response);
            //     }
            // });
     
        }else{
           res.render("registration" , {message: 'Invalid details'});
        };
    }catch(error){
        res.status(200).send("Sorry technical error"+error);
    }
});

//login system

app.post("/login", async(req , res)=>{
    try{
        const lemail = req.body.lemail;
        const lpassword = req.body.lpassword;
        // const loginotp = req.body.loginotp;
        const userdata = await Register.findOne({email:lemail});
        let data = userdata.username;
        const token = jwt.sign({_id:"id"}, "comcodeducationbycryptcodeishereforauthentication");
        localStorage.setItem('mytoken', token);
        req.session.userName= data;

        if(userdata.email === lemail && userdata.password === lpassword){
            res.render("index" , {
                logout:"logout",
                link1:"501", 
                link2:"/UserProfile",
                msg1:userdata.username,
                msg2:"profile",
            });
            
        }    
       
        else{
            res.render("login" , {message:"Invalid detals"});
        }
    }catch(error){
        res.status(404).render("login" , {message:"Invalid detals"});
        console.log("try is not working");
    }
})

app.get("/UserProfile" , checklogin,(req , res)=>{
    const name = req.session.userName;
       res.render("UserProfile" , {
            prouser:name,
       });
        
})

app.listen(port, (req, res) => {

    console.log(`Server is ready at port ${port}`);
})