import mongoose, {Schema} from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const watchHistorySchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    
    watchedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    
}, {timestamps: true})
watchHistorySchema.plugin(aggregatePaginate);
export const Watchhistory = mongoose.model("Watchhistory", watchHistorySchema)