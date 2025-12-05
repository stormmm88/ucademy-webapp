import { Document, model, models, Schema } from "mongoose";

export interface IComment extends Document {
    _id: string;
    content: string;
    course: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    rating: number;
    created_at: Date;
    updated_at: Date;
    status: "APPROVED" | "PENDING" | "REJECTED";
}

const commentSchema = new Schema<IComment>({
    content: {
        type: String,
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    status: {
        type: String,
        enum: ["APPROVED", "PENDING", "REJECTED"],
        default: "PENDING",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    }
});

const Comment = models.Comment || model<IComment>("Comment", commentSchema);
export default Comment;