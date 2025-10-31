import express from 'express'
import cors from 'cors'
import 'dotenv/config'  
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

const app = express()
const PORT = process.env.PORT ||4000
connectDB()
connectCloudinary()
// console.log("Running in", process.env.NODE_ENV, "mode");
// console.log("Mongo URI:", process.env.MONGODB_URI);

//middlewares
app.use(express.json())
//updated on 18-10-25 for cookies
app.use(cookieParser())
// ✅ Dynamic + Flexible CORS setup
const allowedOrigins = [
  process.env.FRONTEND_URL,   // e.g. "https://e-ccomerce-website-frontendd.vercel.app"
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];
// app.use(cors({
//   origin: [
//     process.env.FRONTEND_URL || "http://localhost:5174",
//     "http://localhost:5175"
//   ],
//   credentials: true,
// }));
// ✅ Dynamic CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / curl
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||  // allow any vercel domain (future frontend)
      origin.includes('localhost')
    ) {
      return callback(null, true);
    } else {
      console.warn(`🚫 Blocked by CORS: ${origin}`);
      return callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));

//api endpoints
app.get('/',(req,res)=>{
    res.send('api working correctly')
})

app.use("/api/user", userRouter);
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.listen(PORT,()=>{
  console.log(`Server running on http://localhost:${PORT}`);

})
