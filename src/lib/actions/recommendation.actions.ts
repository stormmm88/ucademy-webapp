"use server"

import { connectToDatabase } from "../mongoose";
import Course, { ICourse } from "@/database/course.model";
import User from "@/database/user.model";
import { auth } from "@clerk/nextjs/server";
import { ECourseStatus } from "@/types/enums";

/**
 * Lấy gợi ý khóa học dựa trên danh mục của các khóa học đã mua
 * @param limit - số lượng khóa học gợi ý
 */
export async function getRecommendedCourses(limit: number = 6): Promise<ICourse[] | undefined> {
    try {
        connectToDatabase();
        
        const { userId } = await auth();
        if (!userId) return [];

        // Lấy thông tin người dùng
        const findUser = await User.findOne({ clerkId: userId });
        if (!findUser || findUser.courses.length === 0) {
            // Nếu chưa mua khóa học nào, trả về các khóa học nổi bật
            return getPopularCourses(limit);
        }

        // Lấy các khóa học mà user đã mua
        const purchasedCourses = await Course.find({
            _id: { $in: findUser.courses }
        }).populate("category");

        // Lấy các danh mục từ các khóa học đã mua
        const categoryIds = [
            ...new Set(
                purchasedCourses
                    .filter(c => c.category)
                    .map(c => c.category._id.toString())
            )
        ];

        if (categoryIds.length === 0) {
            return getPopularCourses(limit);
        }

        // Lấy các khóa học từ cùng danh mục, loại trừ những khóa học đã mua
        const recommendedCourses = await Course.find({
            category: { $in: categoryIds },
            _id: { $nin: findUser.courses },
            status: ECourseStatus.APPROVED,
            _destroy: false
        })
            .limit(limit)
            .sort({ views: -1, created_at: -1 })
            .populate("category");

        // Nếu không đủ khóa học, thêm các khóa học phổ biến
        if (recommendedCourses.length < limit) {
            const additionalCourses = await Course.find({
                _id: { $nin: [...findUser.courses, ...recommendedCourses.map(c => c._id)] },
                status: ECourseStatus.APPROVED,
                _destroy: false
            })
                .limit(limit - recommendedCourses.length)
                .sort({ views: -1, rating: -1 })
                .populate("category");

            return [...recommendedCourses, ...additionalCourses];
        }

        return recommendedCourses;
    } catch (error) {
        console.error("Error getting recommended courses:", error);
        return [];
    }
}

/**
 * Lấy các khóa học phổ biến (dựa trên lượt xem)
 */
export async function getPopularCourses(limit: number = 6): Promise<ICourse[] | undefined> {
    try {
        connectToDatabase();

        const courses = await Course.find({
            status: ECourseStatus.APPROVED,
            _destroy: false
        })
            .limit(limit)
            .sort({ views: -1, rating: -1 })
            .populate("category");

        return courses;
    } catch (error) {
        console.error("Error getting popular courses:", error);
        return [];
    }
}

/**
 * Lấy khóa học theo danh mục
 */
export async function getCoursesByCategory(categoryId: string, limit: number = 10, page: number = 1): Promise<ICourse[] | undefined> {
    try {
        connectToDatabase();

        const skip = (page - 1) * limit;

        const courses = await Course.find({
            category: categoryId,
            status: ECourseStatus.APPROVED,
            _destroy: false
        })
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 })
            .populate("category");

        return courses;
    } catch (error) {
        console.error("Error getting courses by category:", error);
    }
}

/**
 * Gợi ý khóa học dựa trên tìm kiếm từ khóa
 */
export async function getRecommendationBySearch(keyword: string, limit: number = 5): Promise<ICourse[] | undefined> {
    try {
        connectToDatabase();

        const courses = await Course.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { desc: { $regex: keyword, $options: "i" } }
            ],
            status: ECourseStatus.APPROVED,
            _destroy: false
        })
            .limit(limit)
            .sort({ views: -1 })
            .populate("category");

        return courses;
    } catch (error) {
        console.error("Error getting recommendation by search:", error);
    }
}