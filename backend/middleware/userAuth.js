import jwt from "jsonwebtoken";

// const userAuth = async (req, res, next) => {
//   try {
//     // Try reading token from cookie first
//     const token = req.cookies?.token || req.headers?.token;
//     if (!token) {
//       return res.json({ success: false, message: "Not Authorized, Login Again" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded?.id) {
//       return res.json({ success: false, message: "Invalid Token" });
//     }

//     if (!req.body) req.body = {};
//     req.body.userId = decoded.id;

//     next();
//   } catch (error) {
//     console.error("JWT verification error:", error);
//     res.json({ success: false, message: "Invalid or expired token" });
//   }
// };

// export default userAuth;
const userAuth = async (req, res, next) => {
  try {
    const token =  req.cookies?.token || req.headers?.token;
    if (!token) return res.json({ success: false, message: "No token found" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    return res.json({ success: false, message: "Invalid token" });
  }
};

export default userAuth;