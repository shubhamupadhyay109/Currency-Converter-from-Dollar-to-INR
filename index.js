const fs = require('fs');
var multer = require('multer');
const path = require("path") 
const {Parser} = require('json2csv');
const csvjson = require("csvjson")
var nodemailer = require('nodemailer');
const fetch = require("node-fetch") 
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
var values=[];
//Middleware
app.use(bodyParser.urlencoded({extended:true}));
    
var storage = multer.diskStorage({ 
    destination: (req, file, cb)=> { 
        // Uploads is the Upload_folder_name 
        cb(null, "csv") 
    }, 
    filename: (req, file, cb)=> { 
        cb(null, file.fieldname + "-" + Date.now()+".csv") 
    } 
}) 
 
var upload = multer({storage: storage}).single("csv_file");        

app.get("/upload_csv", (req,res)=> {
	res.sendFile(__dirname+"/html/index.html");
})
 
app.post("/upload_csv/", (req, res)=> { 
    upload(req,res,function(err) { 
        if(err) { 
            res.send(err.message) 
        } 
        else { 
            console.log("success. File Uploaded !!");
           const filename=__dirname+"/csv/"+res.req.file.filename
            fs.readFile(filename,'utf-8',(err,val)=>{
                if (err) throw err.message;
                jsonobj=csvjson.toObject(val)
                fetch('https://api.exchangeratesapi.io/latest?base=USD')
                .then(val=>val.json())
                .then(val=>{
                    jsonobj.forEach((e)=>{
                    values.push({"Amounts":(e.Amounts)*(val.rates.INR)})
                    })
                })
           });
        setTimeout(() => {
        const json2csvParser = new Parser({values})
        const csv = json2csvParser.parse(values);
        fs.writeFile(__dirname+"/processcsv/demo"+Date.now()+".csv",csv,(err,val)=>{
            if(err) throw err;
            res.sendFile(__dirname+"/html/index.html");
        })
        }, 1000);
        } 
    }) 
})
app.get("/email",function(req,res) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'XXXXXXXXX@gmail.com',
          pass: 'XXXXXXX'
        }
      });
      
      var mailOptions = {
        from: 'XXXXXXXXX110@gmail.com',
        to: 'XXXXXXX@XXXXX.com',
        subject: 'Sending Email using Node.js',
        text: `Hi Rashida,
                    This is Assignments for LABELBLIND`,
        attachments:[
            {
                filename:"demo1589822081969.csv",
                path:`${__dirname}/processcsv/demo1589822081969.csv`,
                cid:"shubham316@"
            }
        ],        
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          res.send('Email sent successfully')
          transporter.close();
        }
      });
      
})
app.listen(3000, function(req, res){
    console.log('server listening at port no 3000')
});


