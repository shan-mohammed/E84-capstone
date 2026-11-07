const mongoose= require("mongoose");

const userActivitySchema = new mongoose.Schema(
    {
        userId :{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },
          productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
        action:{
            type:String,
            enum:["view", "cart", "wishlist","purchase"],
            required:true,
        },
    },
    {
        timestamps:true,
    }
)
module.exports = mongoose.model(
    "UserActivity",userActivitySchema
);