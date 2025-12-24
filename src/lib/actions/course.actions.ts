'use server'

import { ICourseUpdateParams, TCreateCourseParams, TGetAllCourseParams, TUpdateCourseParams } from "@/types";
import { connectToDatabase } from "../mongoose";
import Course, { ICourse } from "@/database/course.model";
import Category from "@/database/category.model";
import { revalidatePath } from "next/cache";
import Lecture from "@/database/lecture.model";
import Lesson from "@/database/lesson.model";
import { FilterQuery } from "mongoose";
import { ECourseStatus } from "@/types/enums";

//Fetching data

export async function getAllCoursesPublic(params: TGetAllCourseParams & { categorySlug?: string }): Promise<ICourse[] | undefined> {
    try {
        await connectToDatabase();
        const { page = 1, limit = 12, search, categorySlug } = params || {};
        const skip = (page - 1) * limit;
        const query: FilterQuery<typeof Course> = {
            status: ECourseStatus.APPROVED,
            _destroy: false
        };

        // Tìm kiếm theo tên hoặc mô tả
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { desc: { $regex: search, $options: "i" } }
            ];
        }

        // Lọc theo danh mục
        if (categorySlug) {
            const category = await Category.findOne({ 
                slug: categorySlug,
                _destroy: false 
            });
            if (category) {
                query.category = category._id;
            } else {
                // Nếu danh mục không tồn tại, trả về mảng rỗng
                return [];
            }
        }

        const courses = await Course.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 })
            .populate("category")
            .lean();

        return JSON.parse(JSON.stringify(courses)) as ICourse[];
    } catch (error) {
        console.log("Error fetching all courses:", error);
        return [];
    }
}

export async function getAllCourses(params: TGetAllCourseParams): Promise<ICourse[] | undefined> {
    try {
        await connectToDatabase();
        const { page = 1, limit = 10, search, status} = params || {};
        const skip = (page -1) * limit;
        const query: FilterQuery<typeof Course> = {};
        
        if(search){
            query.$or = [{ title: {$regex: search, $options: "i"} }];
        }
        
        if(status){
            query.status = status
        }
        
        const courses = await Course.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1})
            .lean();
            
        return JSON.parse(JSON.stringify(courses)) as ICourse[];
    } catch (error) {
        console.log("Error fetching all courses:", error);
        return [];
    }
}

export async function getCourseBySlug({ slug }: {slug: string}): Promise<ICourseUpdateParams | undefined> {
    try {
        await connectToDatabase();

        const findCourse = await Course.findOne({slug})
            .populate({
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
            })
            .populate("category")
            .lean();

        return findCourse ? JSON.parse(JSON.stringify(findCourse)) as ICourseUpdateParams : undefined;
    } catch (error) {
        console.log("Error fetching course by slug:", error);
        return undefined;
    }
}

//CRUD
export async function createCourse(params: TCreateCourseParams) {
    try {
        await connectToDatabase();
        const course = await Course.create(params);
        return {
            success: true,
            data: JSON.parse(JSON.stringify(course)),
        }
    } catch (error) {
        console.log("Error creating course:", error);
        return {
            success: false,
            message: "Có lỗi xảy ra"
        };
    }
}

export async function updateCourse(params: TUpdateCourseParams) {
    try {
        await connectToDatabase();
        const findCourse = await Course.findOne({slug: params.slug});
        if(!findCourse) {
            return {
                success: false,
                message: "Khóa học không tồn tại"
            };
        }
        
        await Course.findOneAndUpdate({slug: params.slug}, params.updateData, {new: true,});
        revalidatePath(params.path || '/');
        return {
            success: true,
            message: "Cập nhật khóa học thành công",
        }
    } catch (error) {
        console.log("Error updating course:", error);
        return {
            success: false,
            message: "Có lỗi xảy ra"
        };
    }
}