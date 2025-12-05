"use server"

import { connectToDatabase } from "../mongoose";
import Comment, { IComment } from "@/database/comment.model";
import User from "@/database/user.model";
import Course from "@/database/course.model";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";
import { TCreateCommentParams, TGetAllCommentsParams, TUpdateCommentParams } from "@/types";

export async function createComment(params: TCreateCommentParams) {
    try {
        connectToDatabase();
        const { userId } = await auth();
        
        if (!userId) {
            return {
                success: false,
                message: "Bạn cần đăng nhập để đánh giá"
            };
        }

        const findUser = await User.findOne({ clerkId: userId });
        if (!findUser) {
            return {
                success: false,
                message: "Không tìm thấy người dùng"
            };
        }

        // Kiểm tra user đã mua khóa học chưa
        const hasCourse = findUser.courses.includes(params.course);
        if (!hasCourse) {
            return {
                success: false,
                message: "Bạn cần mua khóa học để đánh giá"
            };
        }

        // Kiểm tra đã đánh giá chưa
        const existingComment = await Comment.findOne({
            user: findUser._id,
            course: params.course
        });

        if (existingComment) {
            return {
                success: false,
                message: "Bạn đã đánh giá khóa học này rồi"
            };
        }

        const newComment = await Comment.create({
            content: params.content,
            course: params.course,
            user: findUser._id,
            rating: params.rating,
        });

        // Cập nhật rating cho course
        const course = await Course.findById(params.course);
        if (course) {
            course.rating.push(params.rating);
            await course.save();
        }

        revalidatePath(params.path || "/");

        return {
            success: true,
            message: "Đánh giá thành công",
            data: JSON.parse(JSON.stringify(newComment))
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Có lỗi xảy ra"
        };
    }
}

export async function getAllComments(params: TGetAllCommentsParams): Promise<IComment[] | undefined> {
    try {
        connectToDatabase();
        const { page = 1, limit = 10, search, status, course } = params || {};
        const skip = (page - 1) * limit;
        const query: FilterQuery<typeof Comment> = {};

        if (search) {
            query.$or = [
                { content: { $regex: search, $options: "i" } }
            ];
        }

        if (status) {
            query.status = status;
        }

        if (course) {
            query.course = course;
        }

        const comments = await Comment.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 })
            .populate({
                path: "user",
                model: User,
                select: "name avatar email"
            })
            .populate({
                path: "course",
                model: Course,
                select: "title image"
            });

        return comments;
    } catch (error) {
        console.error("Error fetching comments:", error);
    }
}

export async function updateComment(params: TUpdateCommentParams) {
    try {
        connectToDatabase();
        const { commentId, updateData, path } = params;

        await Comment.findByIdAndUpdate(commentId, {
            ...updateData,
            updated_at: Date.now()
        }, { new: true });

        if (path) {
            revalidatePath(path);
        }

        return {
            success: true,
            message: "Cập nhật bình luận thành công"
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Có lỗi xảy ra"
        };
    }
}

export async function deleteComment(commentId: string, path?: string) {
    try {
        connectToDatabase();
        
        // Lấy comment để cập nhật lại rating của course
        const comment = await Comment.findById(commentId);
        if (comment) {
            const course = await Course.findById(comment.course);
            if (course) {
                // Xóa rating này khỏi mảng rating
                course.rating = course.rating.filter((r: number, index: number) => {
                    // Tìm và xóa rating đầu tiên bằng với rating của comment
                    if (r === comment.rating && !course.rating.slice(0, index).includes(comment.rating)) {
                        return false;
                    }
                    return true;
                });
                await course.save();
            }
        }

        await Comment.findByIdAndDelete(commentId);

        if (path) {
            revalidatePath(path);
        }

        return {
            success: true,
            message: "Xóa bình luận thành công"
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Có lỗi xảy ra"
        };
    }
}

export async function getCourseComments(courseId: string): Promise<IComment[] | undefined> {
    try {
        connectToDatabase();
        
        const comments = await Comment.find({
            course: courseId,
            status: "APPROVED"
        })
            .sort({ created_at: -1 })
            .populate({
                path: "user",
                model: User,
                select: "name avatar"
            });

        return comments;
    } catch (error) {
        console.log(error);
    }
}