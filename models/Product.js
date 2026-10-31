const mongoose= require("mongoose");

const productSchema =new mongoose.Schema(
    {
        title:{
            type:String,
            required :[true, "Product name is required"],
            trim : true
        }, 
    price:{
        type :Number,
        required :[true,"Product price is required"]
      
    },
     category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },

    brand: {
      type: String,
      default: "Other",
      trim: true,
    },
   imageUrl: {
    type: String,
    required: true,
  },

  imagePublicId: {
    type: String,
  },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);


    
  