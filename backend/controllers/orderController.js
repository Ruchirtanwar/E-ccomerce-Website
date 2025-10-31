
import orderModal from "../modals/orderModal.js";
import userModal from "../modals/userModal.js";
import Stripe from "stripe"

//global variables
const currency = 'inr'
const deliveryCharge = 10
//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
//placing orders using cod method
const placeOrder = async (req, res) => {
  console.log(req.body);

  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      address,
      amount,
      // paymentMethid: "COD",
      payment: false,
       paymentMethod: req.body.paymentMethod, // ✅ ADD THIS LINE

      date: Date.now(),
    };
    const newOrder =  new orderModal(orderData)
    await newOrder.save()
await userModal.findByIdAndUpdate(userId,{cartData:{}})
res.json({success:true,message:'Order Placed'})
  } catch (error) {
    console.log(error);
  res.json({success:false, message:error.message })
  }
};
//placing orders using Stripe method
const placeOrderStripe = async (req, res) => {
  try {
     const { userId, items, amount, address } = req.body;
   const {origin} = req.headers;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethid: "COD",
      payment: false,
      date: Date.now(),
    };
      const newOrder =  new orderModal(orderData)
    await newOrder.save()

    const line_items = items.map((item)=>({
       price_data:{
        currency:currency,
        product_data:{
          name:item.name
        },
        unit_amount:item.price *100
      },
      quantity:item.quantity
    }))
    line_items.push({
      price_data:{
        currency:currency,
        product_data:{
          name:'Delivery Charges'
        },
        unit_amount:deliveryCharge *100
      },
      quantity:1
    })
    const session = await Stripe.Checkout.Sessions.create({
      success_url : `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
  line_items,
  mode:'payment',
    })
    res.json({success:true,session_url:session.url})
  } catch (error) {
    console.log(error)
     res.json({success:false, message:error.message })

  }
};
//verify Stripe
const verifyStripe = async (req,res)=>{
    const {orderId,success,userId}  = req.body
    try {
        if (success === 'true') {
            await orderModal.findByIdAndUpdate(orderId,{payment:true});
             await userModal.findByIdAndUpdate(userId,{cartData:{}});
       res.json({success:true})
            }
            else{
                await orderModal.findByIdAndDelete(orderId)
                res.json({success:false})
            }
    } catch (error) {
       console.log(error);
  res.json({success:false, message:error.message })
   
    }
}
//placing orders using razorpay method
const placeOrderRazorpay = async (req, res) => {};
//verify razorpay
const verifyRazorpay = async (req,res)=>{
    try {
        const{userId,razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
if (orderInfo.status === 'paid') {
    await orderModal.findByIdAndUpdate(orderInfo.receipt,{payment:true})
    await userModal.findByIdAndUpdate(userId,{cartData:{}})
res.json({success:true,message:"Payment Successful"})
}
else{
    res.json({success:false , message:"Payment Failed"})
}
    } catch (error) {
     console.log(error);
  res.json({success:false, message:error.message })
      
    }
}
//all orders data from admin panel
const allOrders = async (req, res) => {
    try {
        const orders= await orderModal.find({})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error);
  res.json({success:false, message:error.message })  
    }
};

//user order data from frotnend
const userOrders = async (req, res) => {
    try {
        // const {userId}= req.body;
        // const orders = await orderModal.find({orders})
        const userId = req.body.userId; // or req.user.id if using auth middleware
    const orders = await orderModal.find({ userId }).sort({ _id: -1 }); // ✅ define first

       
        res.json({success:true , orders})
    } catch ( error) {
          console.log(error);
  res.json({success:false, message:error.message })
    }
};

//update order status fom admin panel
const updateStatus = async (req, res) => {
    try {
        const {orderId,status} = req.body
        await orderModal.findByIdAndUpdate(orderId,{status})
        res.json({success:true,message:"Status Updated"})
    } catch (error) {
    console.log(error);
  res.json({success:false, message:error.message })
        
    }
};

// Update payment status of an order
 const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, payment } = req.body;

    // Check if orderId exists
    const order = await orderModal.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

   // Update payment status
    // if (payment === "Done") {
    //   order.payment = true;
    // } else if (payment === "Pending") {
    //   order.payment = false;
    // } else if (payment === "Refunded") {
    //   order.payment = "Refunded"; // Optional third state
    // }
    order.payment = payment === "Done"; // Set to true if payment is "Done", otherwise false

    await order.save();

    res.json({ success: true, message: "Payment status updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};




export {
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
  updatePaymentStatus
};
