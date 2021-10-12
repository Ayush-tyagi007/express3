const mongoose =require ("mongoose")
const ImageSchema =new mongoose.Schema({
    image:{type:String,
    required:true},
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    }
})
module.exports=image=mongoose.model("image",ImageSchema)