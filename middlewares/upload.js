const multer =require("multer");

const storage = multer.memoryStorage();

const upload =multer({
    storage,
 
    fileFilter: (req,file,cb)=>{
       if(file.mimetype.startsWith("image/")){
        console.log(file.mimetype);
        cb(null, true);
       } else {
        cb(new Error("Only image files are allowed"));
       }
    },
    
})

module.exports = upload;