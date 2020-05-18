const fs = require('fs');
var multer = require('multer');
const path = require("path") 
const {Parser} = require('json2csv');
const csvjson = require("csvjson") 
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
var values=[];
//Middleware
app.use(bodyParser.urlencoded({extended:true}));
    
var storage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
        // Uploads is the Upload_folder_name 
        cb(null, "csv") 
    }, 
    filename: function (req, file, cb) { 
        cb(null, file.fieldname + "-" + Date.now()+".csv") 
    } 
}) 
 
var upload = multer({storage: storage}).single("csv_file");        

app.get("/upload_csv",  function(req,res) {
	res.sendfile(__dirname+"/html/index.html");
})
 
app.post("/upload_csv/",function (req, res, next) { 
    upload(req,res,function(err) { 
        if(err) { 
            res.send(err) 
        } 
        else { 
            console.log("success. File Uploaded !!");
            
           const filename=__dirname+"/csv/"+res.req.file.filename
            fs.readFile(filename,'utf-8',(err,val)=>{
                if (err) throw err.message;
                jsonobj=csvjson.toObject(val)
                jsonobj.forEach((e)=>{
                    values.push({"Amounts":(e.Amounts)*75})
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
// app.get("/process",function(req,res,next) {
//     console.log(res.file.filename)
// })
app.listen(3000, function(req, res){
    console.log('server listening at port no 3000')
});


