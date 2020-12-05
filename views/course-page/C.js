app.get("/c" , (req , res)=>{
    res.render("course-page" , {
        target:"C Course",
        couses:"What is c language",
        His_cou:"History of c language",
        msg:"The C Language is developed by Dennis Ritchie for creating system applications that directly interact with the hardware devices such as drivers, kernels, etc",

    })
});


app.get("/java" , (req , res)=>{
    res.render("course-page" , {
        target:"java Course",
        course:"What is java language",
        His_cou:"History of java language",
        msg:"The java Language is developed by Dennis Ritchie for creating system applications that directly interact with the hardware devices such as drivers, kernels, etc",

    })
});