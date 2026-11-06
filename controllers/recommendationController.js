const Product =require("../models/Product")


const getRecommendations = async (req,res)=>{
    try {
        const {productId} =req.params;
        const currentProduct =await Product.findById(productId)

        if(!currentProduct){
            return res.status(404).json({
                success : false,
                message :"Product not found"
            })
        }

        const recommendations = await Product.find({
            _id : {$ne :productId},
            $or:[
                {category:currentProduct.category},
                {brand:currentProduct.brand},
            ],
        })
        .sort({rating:-1})
        .limit(4);

        return res.status(200).json({
            success:true,
            message:"Recommendation fetched successfully",
            data: recommendations,
        })
    } catch (error) {
        console.error("Recommendation error:",error)

        res.status(500).json({
            success :false,
            message :"Failed to fetch recommendations"
        })
    }
}

module.exports ={getRecommendations}