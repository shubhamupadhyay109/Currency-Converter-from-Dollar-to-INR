const fs = require('fs');
var multer = require('multer');
const path = require("path") 
const {Parser} = require('json2csv');
const csvjson = require("csvjson") 
const express=require("express");
const app=express();
const bodyParser=require("body-parser");
//const json2csvParser = new Parser()
var values=[];
let arr=[ { Amounts: 75 },
    { Amounts: 150 },
    { Amounts: 225 },
    { Amounts: 300 },
    { Amounts: 375 },
    { Amounts: 450 },
    { Amounts: 525 },
    { Amounts: 600 },
    { Amounts: 675 },
    { Amounts: 750 },
    { Amounts: 825 },
    { Amounts: 900 } ]

const json2csvParser = new Parser();
const csv = json2csvParser.parse(arr);
fs.writeFile("demo.csv",csv,(err,val)=>{
    if(err) throw err;
    console.log(val)
})
