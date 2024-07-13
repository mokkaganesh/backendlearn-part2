import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String,//cloudinary url
        required:[true,"Video file is required"]
    },
    thumbnail:{
        type:String,//cloudinary url
        required:[true,"Thumbnail is required"]
    },
    title:{
        type:String,
        required:[true,"Title is required"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"Description is required"],
    },
    duration:{
        type:Number,
        required:[true,"Duration is required"],
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    
},{timestamps:true});

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);