//khai báo cấu trúc dữ liệu cho user
//clerk lưu trữ thông tin người thông qua clerkId

import { EUserRole, EUserStatus } from "@/types/enums";
import { Document, model, models, Schema } from "mongoose";

export interface IUser extends Document {
    clerkId: string;
    name: string;
    username: string;
    email_address: string;
    avatar: string;
    creatAt: Date;
    status: EUserStatus;
    role: EUserRole;
    courses: Schema.Types.ObjectId[];
}
//tạo schema để khi đăng kí vào model User trong mongoose, mongoose sẽ biết chúng ta có sử dụng đúng cấu trúc hay không
const userSchema = new Schema<IUser>({
    clerkId: {
        type: String,
    },
    name: {
        type: String,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email_address: {
        type: String,
        unique: true,
        required: true,
    },
    avatar: {
        type: String,
    },
    courses: [
        {
            type: Schema.Types.ObjectId,
            ref: "course" //liên kết tới model course
        }
    ],
    creatAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: Object.values(EUserRole),
        default: EUserRole.USER,
    },
    status: {
        type: String,
        enum: Object.values(EUserStatus),
        default: EUserStatus.ACTVE,
    }
});

const User = models.User || model("User", userSchema);
//mục đích: khai báo model trong mongoose. models là 1 đối tượng trong mongoose, nó chứa tất cả những model đã đăng kí trước đó
// nếu mà cái models đăng kí đã có User thì dùng (trong trường hợp là chưa khai báo sẽ trả về undefined)
// sau đó nó chạy sang model, model này truyền vào 2 cái là tên model(User), cái thứ là schema => chúng ta đăng kí 1 model có tên
// là "User" và sử dung schema là "userchema"
export default User;

