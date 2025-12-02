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

const uploadMultiple = multer({
    storage: storage
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

module.exports = {upload,uploadMultiple};




// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//     destination: "./uploads/",
//     filename: (req, file, cb) => {
//         cb(null, "image-" + Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({
//     storage,
//     limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
//     fileFilter: (req, file, cb) => {
//         const allowed = /jpg|jpeg|png|gif/;
//         const extValid = allowed.test(path.extname(file.originalname).toLowerCase());
//         const mimeValid = allowed.test(file.mimetype);

//         if (extValid && mimeValid) cb(null, true);
//         else cb("Only image files allowed!");
//     }
// });

// module.exports = upload;









// route.post('/upload', (req, res) => {
//     console.log(req);
//     upload(req, res, (err) => {
//         console.log(req);
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: err });
//         }
//         if (!req.file) {
//             return res.status(400).json({ error: 'Please send file' });
//         }
//         console.log(req.file);
//         res.send('File uploaded!');
//     });
// });

// var upload = multer({dest: 'uploads/'})

// route.use("/single",upload.single("image"),(req,res) => {
    //     try {
        //         return res.send(req.file)
//     } catch (error) {
//         console.log(error);
//         return res.send(400);
//     }
// });

// route.use("/bulk",upload.array("image",4),(req,res) => {
//     try {
//         return res.send(req.files)
//     } catch (error) {
//         console.log(error);
//         return res.send(400);
//     }
// });

// module.exports = upload;



