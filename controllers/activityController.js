const UserActivity =require ("../models/UserActivity");

const trackActivity = async(req,res)=>{
    try {
        const {productId,action} =req.body;
        if(!productId  || !action){
            return res.status(400).json({
                success:false,
                message:"ProductId and action are required"
            })
        }

        const allowedActions =[
            "view",
            "cart",
            "wishlist",
            "purchase",
        ];
        if(!allowedActions.includes(action)){
            return res.status(400).json({
                success :false,
                message :"Invalid activity type"
            })
        }
        const activity = await UserActivity.create({
            userId:req.user.id,
            productId,
            action,
        })
        return res.status(201).json({
            success:true,
            message:"Customer activity tracked",
            data:activity,
        })
    } catch (error) {
       console.error("Activity tracking error:",error)
       return res.status(500).json({
        success :false,
        message:"Failed to track activity"
       }) 
    }
}

module.exports = {trackActivity}