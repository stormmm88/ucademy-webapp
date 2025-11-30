'use server'

import { ICourseUpdateParams, TCreateCourseParams, TGetAllCourseParams, TUpdateCourseParams } from "@/types";
import { connectToDatabase } from "../mongoose";
import Course, { ICourse } from "@/database/course.model";
import { revalidatePath } from "next/cache";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import { FilterQuery } from "mongoose";
import { ECourseStatus } from "@/types/enums";

//Fetching data

export async function getAllCoursesPublic(params: TGetAllCourseParams): Promise<ICourse[] | undefined> {
    try {
        connectToDatabase();
        const { page = 1, limit = 10, search} = params || {};
        const skip = (page -1) * limit;
        const query: FilterQuery<typeof Course> = {};
        if(search){
            query.$or = [{ title: {$regex: search, $options: "i"} }];
        }
        query.status = ECourseStatus.APPROVED;
        const courses = await Course.find(query).skip(skip).limit(limit).sort({ created_at: -1});
        return courses;
    } catch (error) {
        console.error("Error fetching all courses:", error);
    }
}

export async function getAllCourses(params: TGetAllCourseParams): Promise<ICourse[] | undefined> {
    try {
        connectToDatabase();
        const { page = 1, limit = 10, search, status} = params || {};
        const skip = (page -1) * limit;
        const query: FilterQuery<typeof Course> = {};
        if(search){
            query.$or = [{ title: {$regex: search, $options: "i"} }];
        }
        if(status){
            query.status = status
        }
        const courses = await Course.find(query).skip(skip).limit(limit).sort({ created_at: -1});
        return courses;
    } catch (error) {
        console.error("Error fetching all courses:", error);
    }
}

export async function getCourseBySlug({ slug }: {slug: string}): Promise<ICourseUpdateParams | undefined> {
    try {
        connectToDatabase();

        //populate: dựa vào đường dẫn để truy vấn các document liên quan tới collection khác
        //vd: lấy ra các trường (fiels) ở trong collection lectures
        //yều cầu: phải trỏ tới collection cần lấy
        const findCourse = await Course.findOne({slug}).populate({
            path: 'lectures',
            model: Lecture,
            select: '_id title',
            match: {
                _destroy: false
            },
            populate: {
                path: 'lessons',
                model: Lesson,
                match: {
                    _destroy: false,
                }
            }
        });
        return findCourse;
    } catch (error) {
        console.error("Error fetching course by slug:", error);
    }
}


//CRUD
export async function createCourse(params: TCreateCourseParams) {
    try {
        connectToDatabase();
        const course = await Course.create(params);
        return {
            success: true,
            data: JSON.parse(JSON.stringify(course)),
        }
    } catch (error) {
        console.error("Error creating course:", error);
    }
}

export async function updateCourse(params: TUpdateCourseParams) {
    try {
        connectToDatabase();
        const findCourse = await Course.findOne({slug: params.slug});
        if(!findCourse) return;
        await Course.findOneAndUpdate({slug: params.slug}, params.updateData, {new: true,});
        revalidatePath(params.path || '/');
        return {
            success: true,
            message: "Cập nhật khóa học thành công",
        }
    } catch (error) {
        console.error("Error updating course:", error);
    }
}