import { ELessonType } from "@/types/enums";
import { Document, model, models, Schema } from "mongoose";

export interface ILesson extends Document {
    _id: string;
    title: string;
    slug: string;
    lecture: Schema.Types.ObjectId;
    course: Schema.Types.ObjectId;
    order: number;
    duration: number;
    video_url: string;
    content: string;
    type: ELessonType;
    _destroy: boolean;
    created_at: Date;
}

const lessonSchema = new Schema<ILesson>({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    lecture: {
        type: Schema.Types.ObjectId,
        ref: "Lecture"
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course"
    },
    order: {
        type: Number,
        default: 0,
    },
    duration: {
        type: Number,
        default: 0,
    },
    video_url: {
        type: String,
    },
    content: {
        type: String,
    },
    type: {
        type: String,
        enum: Object.values(ELessonType),
        default: ELessonType.VIDEO,
    },
    _destroy: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
})

const Lesson = models.Lesson || model<ILesson>("Lesson", lessonSchema);
export default Lesson;