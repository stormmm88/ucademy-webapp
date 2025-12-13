"use server"

import User, { IUser } from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { TCreateUserParams, TGetAllUserParams, TUpdateUserParams } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { ICourse } from "@/database/course.model";
import { ECourseStatus } from "@/types/enums";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
// import Course from '@/database/course.model';

export  async function createUser(params: TCreateUserParams) {
    try {
        connectToDatabase();
        const newUser = await User.create(params);
        return newUser;
    } catch (error) {
        console.log(error)
    }
}

export async function getUserInfo({ userId }: { userId: string }): Promise<IUser | null | undefined> {
    try {
        connectToDatabase(); //userId chính là clerkId vì chúng ta lấy auth() từ clerk nên nó sẽ lấy id của clerk
        const findUser  = await User.findOne({ clerkId: userId });
        if(!findUser) return null;
        return JSON.parse(JSON.stringify(findUser));
        
    } catch (error) {
       console.log(error) 
    }
}

export async function getUserCourses(): Promise<ICourse[] | undefined | null> {
    try {
        await connectToDatabase();
        const { userId } = await auth();
        const findUser = await User.findOne({ clerkId: userId }).populate({
            path: 'courses',
            model: "Course",
            match: {
                status: ECourseStatus.APPROVED
            }
        });
        if(!findUser) return [];
        return findUser.courses
    } catch (error) {
        console.log(error)
    }
}

export async function getAllUsers(params: TGetAllUserParams): Promise<IUser[] | undefined> {
    try {
        connectToDatabase();
        const { page = 1, limit = 10, search, status } = params || {};
        const skip = (page - 1) * limit;
        const query: FilterQuery<typeof User> = {};
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }
        
        if (status) {
            query.status = status;
        }
        
        const users = await User.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });
            
        return users;
    } catch (error) {
        console.error("Error fetching all users:", error);
    }
}

export async function updateUser(params: TUpdateUserParams) {
    try {
        connectToDatabase();
        const { userId, updateData, path } = params;
        
        await User.findByIdAndUpdate(userId, updateData, { new: true });
        
        if (path) {
            revalidatePath(path);
        }
        
        return {
            success: true,
            message: "Cập nhật người dùng thành công",
        };
    } catch (error) {
        console.error("Error updating user:", error);
        return {
            success: false,
            message: "Có lỗi xảy ra khi cập nhật người dùng",
        };
    }
}