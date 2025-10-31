import multer from "multer";
const storage = multer.diskStorage({
    filename:function(req,file,callback){
        callback(null,file.originalname)
    }
})
const Upload = multer({storage})
export default Upload