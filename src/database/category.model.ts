import { Document, model, models, Schema } from "mongoose";

export interface ICategory extends Document {
    _id: string;
    name: string;
    slug: string;
    created_at: Date;
    _destroy: boolean;
}

const categorySchema = new Schema<ICategory>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    _destroy: {
        type: Boolean,
        default: false,
    }
});

const Category = models.Category || model<ICategory>("Category", categorySchema);
export default Category;