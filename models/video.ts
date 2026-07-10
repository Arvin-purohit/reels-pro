import mongoose, { model, Schema } from "mongoose";
import { models } from "mongoose";

export const VIDEO_DIMENESIONS = {
    height : 1920,
    width : 1080
} as const

export interface IVideo {
    _id? : mongoose.Types.ObjectId;
    title : string;
    description : string;
    thumbnailUrl : string;
    videoUrl :string
    controls? : boolean

      likes?: string[];


    transformations? : {
        height : number,
        width : number,
        quality : number
    }
    createdAt : Date
    updatedAt : Date
}

const videoSchema = new Schema<IVideo>({
    title : {type : String , required : true},
    description : {type : String , required : true},
    thumbnailUrl : {type : String , default : ''},
    videoUrl : {type : String , required : true},
    controls : {type : Boolean , default : true},
    likes: {
  type: [String],
  default: [],
},
    transformations : {
        heigth : {type : Number , default : VIDEO_DIMENESIONS.height},
        width : {type : Number , default : VIDEO_DIMENESIONS.width},
        quality : {type : Number , min : 1 , max : 100}

    }
}, {
    timestamps : true
})

const Video = models?.Video || model<IVideo>("Video", videoSchema)

export default Video