const express = require("express");
const path = require("path");
const multer = require("multer");
const hbs = require("hbs");
const passport = require('passport')
const mailer = require("nodemailer");

// const {json} = require("express");

require('./db/conn');
const Register = require("./models/userschema");
const Job_Register = require("./models/jobschema");
const { profile } = require("console");
const { getMaxListeners } = require("process");
const app = express();

app.use(passport.initialize());
app.use(passport.session());

// for save data in database
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//port
const port = process.env.PORT || 3000;

// static file
app.use(express.static('public'));
// partial use 
app.set("view engine" , "hbs");

//root directory Public
const partial = path.join(__dirname , "/views/partials");
hbs.registerPartials(partial);

//root page index.hbs(Home page)
app.get("/" , (req, res)=>{
    res.render("index" , {
        link1:"/registration", link2:"/login",
        msg1:"Sign-up" , msg2:"Login"});
});

// courses page
app.get("/courses" , (req , res)=>{
    res.render("courses");
});
// job-portal page 
app.get("/job-portal" , async(req , res)=>{

    const userdata = await Job_Register.findOne({});
    res.render("job-portal" ,{
            name:userdata.job_name,
            Comcod_Link:userdata.job_link
    });
});
// about page

app.get("/about" , (req , res)=>{
    res.render("about");
});

// contact page
app.get("/contact" , (req , res)=>{
    res.render("contact");
});

// for registration page

app.get("/registration" , (req , res)=>{
    res.render("registration");
});

app.get("/login" , (req , res)=>{
    res.render("login");
})

// Temporary Storage

var Storage = multer.diskStorage({
    destination:'/public/logo',
    filename:(req , file , cb)=>{
        cb(null,file.fieldname+'_'+Date.now()+path.extname(file.originalname));
    }
  });

var upload = multer({ storage: Storage }).single('file');

app.post("/add_job",upload,async(req , res , next)=>{
    try{
        const addschema = new Job_Register({
            logo:req.body.file,
            job_name:req.body.job_name,
            job_link:req.body.job_link
        });
        const adddata = await addschema.save();
        res.render("jobadd" , {
            message:"job added successfully",
        })
    }
    catch(error){
        res.render("jobadd" , {
            message:"404 Error "
        });
    }
});

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
            var transporter = mailer.createTransport({
                service:'gmail' , 
                auth:{

                    user:'projectrana08@gmail.com',
                    pass:'comcodteam'
                    
                }
            });
            
            var mailOptions = {
                from:'projectrana08@gmail.com',
                to: req.body.email,
                subject: 'Welcome to comcod '+"OTP : 10579",
                text:'Hi '+' '+ req.body.username +' '+ 'welcome to comcod' +' '+"Congratulations on being part of the team! The whole team members welcomes you and we look forward to a successful journey with you! Welcome aboard A big congratulations on your new role."
            };
            transporter.sendMail(mailOptions , (error , info)=>{
                if(error){
                    console.log(error);
                }
                else{
                    console.log('Email send' +info.response);
                }
            });
     
        }else{
           res.render("registration" , {message: 'Invalid details'});
        };
    }catch(error){
        res.status(200).send(error);
    }
});

//login system

app.post("/login", async(req , res)=>{
    try{
        const lemail = req.body.lemail;
        const lpassword = req.body.lpassword;
        const loginotp = req.body.loginotp;
        const userdata = await Register.findOne({email:lemail});
        if(userdata.email === lemail && userdata.password === lpassword && loginotp == 10579){
            res.render("index" , {
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
    }
})

app.get("/UserProfile" , (req , res)=>{
       res.render("UserProfile");
        
})

app.get('/courses',checkAuthentication,function(req,res){
    res.render('courses');
});
function checkAuthentication(req,res,next){
    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect("/login");
    }
}

app.listen(port, (req, res) => {

    console.log(`Server is ready at port ${port}`);
})