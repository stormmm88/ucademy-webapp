import { ECouponType } from "@/types/enums";
import { Document, model, models, Schema } from "mongoose";

export interface ICoupon extends Document {
    _id: string;
    title: string;
    code: string;
    active: boolean;
    start_at: Date;
    end_at: Date;
    limit: number;
    courses: Schema.Types.ObjectId[];
    type: ECouponType;
    value: number;
    created_at: Date;
}

const couponSchema = new Schema<ICoupon> ({
    title: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true },
    start_at: { type: Date},
    end_at: { type: Date},
    limit: { type: Number},
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    type: { type: String, enum: Object.values(ECouponType), default: ECouponType.PERCENT},
    value: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
});

const Coupon = models.Coupon || model<ICoupon>("Coupon", couponSchema);
export default Coupon;