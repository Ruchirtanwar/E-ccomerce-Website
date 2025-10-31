// import jwt from 'jsonwebtoken'
// const authUser = async (req,res,next)=>{
//     const {token} = req.headers;
//     if(!token){
//         return res.json({success:false, Message:'Not Authorized Login Again'})
//     }
//     try {
//         const token_decode = jwt.verify(token,process.env.JWT_SECRET)
//         req.body.userId =token_decode.id
//         next()
//     }
//      catch (error) {
//        console.log(error)
//        res.json({success:false, message:error.message}) 
//     }
// }
// export default authUser
// import jwt from 'jsonwebtoken'

// const authUser = (req, res, next) => {
//   try {
//     const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1])

//     if (!token) return res.status(401).json({ message: 'Not authorized' })

//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     req.user = decoded
//     next()
//   } catch (err) {
//     return res.status(401).json({ message: 'Token invalid or expired' })
//   }
// }
// export default authUser;

 import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  // ✅ Check both cookies and headers
  const token = req.cookies?.token || req.headers?.token;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.id) {
      // ✅ Ensure req.body exists before assigning
      if (!req.body) req.body = {};
      req.body.userId = decodedToken.id;
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized, Invalid Token" });
    }
  } catch (error) {
    console.error("JWT verification error:", error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
