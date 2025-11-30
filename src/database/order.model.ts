import { EOrderStatus } from "@/types/enums";
import { Document, model, models, Schema } from "mongoose";

export interface IOrder extends Document {
    _id: string;
    created_at: Date;
    code: string;
    course: Schema.Types.ObjectId;
    user: Schema.Types.ObjectId;
    status: EOrderStatus;
    total: number;
    amount: number;
    discount: number;
    coupon: Schema.Types.ObjectId;
}

const OrderSchema = new Schema<IOrder> ({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    total: {
        type: Number,
    },
    amount: {
        type: Number,
    },
    discount: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    coupon: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
    }, 
    status: {
        type: String,
        enum: Object.values(EOrderStatus),
        default: EOrderStatus.PENDING,
    }
});

const Order = models.Order || model<IOrder>("Order", OrderSchema);
export default Order;