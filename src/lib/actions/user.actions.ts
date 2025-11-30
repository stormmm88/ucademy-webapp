"use server"

import User, { IUser } from "@/database/user.model";
import { connectToDatabase } from "../mongoose"
import { TCreateUserParams } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { ICourse } from "@/database/course.model";
import { ECourseStatus } from "@/types/enums";
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
        return findUser;
        
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