const Product = require("../models/Product");
const cloudinary =require("../config/cloudinary")


const uploadProductImage = async (req,res)=>{
  try {
    console.log("Uploaded file:", req.file);
    if(!req.file){
      return res.status(400).json({
        success :false, 
        message:"Please select an image"
      })
    }
 
    const result = await new Promise((resolve,reject)=>{
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "ecommerce-products",
          resource_type :"image" ,
        },
        (error,result)=>{
        if(error){
          return reject(error);
       }
       resolve (result)
        }
      );
      stream.end(req.file.buffer);
    })
    return res.status(201).json({
      success:true,
      message:"Image uploaded successfully",
      data:{
        imageUrl:result.secure_url,
        publicId:result.public_id,
      },
    })

  } catch (error) {
    console.error("Image upload error:",error);

    return res.status(500).json({
      success:false,
      message:"Failed to upload image"
    })
  }
}
// GET all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
    });
  }
};

// GET a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
    });
  }
};

// create product
const createProduct = async (req, res) => { 
  let uploadedImage; 
  try { 
    if (!req.file) { return res.status(400).json({
       success: false, 
       message: "Please select a product image", 
       });
       }
        // Upload image to Cloudinary
         uploadedImage = await new Promise((resolve, reject) => {
           const stream = cloudinary.uploader.upload_stream(
             { folder: "ecommerce-products", 
              resource_type: "image",
             }, 
             (error, result) => {
               if (error) return reject(error);
                resolve(result); 
              } 
            ); 
            
            stream.end(req.file.buffer); }); 
            // Create product in MongoDB
              const product = await Product.create({ 
                ...req.body,
                 price: Number(req.body.price),
                  rating: req.body.rating 
                  ? Number(req.body.rating) : 0,
                   imageUrl: uploadedImage.secure_url,
                   imagePublicId: uploadedImage.public_id,
                   }); 
                   
                   return res.status(201).json({
                     success: true,
                      message: "Product created successfully",
                       data: product,
                       }
                      );
                     } catch (error) { 
                      console.error("Create product error:", error);
                       // Delete uploaded image if product creation fails 
                        if (uploadedImage) { await cloudinary.uploader.destroy(uploadedImage.public_id); }
                         return res.status(500).json({
                           success: false, 
                           message: "Failed to create product", 
                           error: error.message,
                          
                           }); 
                          } 
                        };

// UPDATE a product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument:"after",
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
    
      message: "Failed to update product" 
    });
  }
};

// DELETE a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

module.exports = {
  uploadProductImage,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,

};