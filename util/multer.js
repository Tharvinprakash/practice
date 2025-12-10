const express = require('express')
const route = express.Router();
const path = require('path')
const multer = require('multer');


const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        console.log("file fieldname",file.fieldname)
        console.log("Date now()",Date.now())
        console.log("path.extname(file.originalname)",path.extname(file.originalname))
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
})



function checkFileType(file,cb){
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    console.log(file.mimetype);
    const mimetype = fileTypes.test(file.mimetype);
    
    if(mimetype && extname){
        return cb(null,true);
    }
    else{
        cb("Error: Images Only! (jpeg, jpg, png, gif)")
    }
}





const excelStorage = multer.memoryStorage();

const excelUpload = multer({
    storage: excelStorage,
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
            return cb(new Error("Only Excel files are allowed!"), false);
        }
        cb(null, true);
    }
});


module.exports = {upload,excelUpload};





