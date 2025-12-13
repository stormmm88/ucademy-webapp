"use server"

import { connectToDatabase } from "../mongoose";
import Order from "@/database/order.model";
import Comment from "@/database/comment.model";
import { EOrderStatus } from "@/types/enums";

/**
 * Lấy số lượng đơn hàng chờ duyệt (PENDING)
 */
export async function getPendingOrdersCount(): Promise<number> {
    try {
        connectToDatabase();
        
        const count = await Order.countDocuments({
            status: EOrderStatus.PENDING
        });
        
        return count;
    } catch (error) {
        console.error("Error fetching pending orders count:", error);
        return 0;
    }
}

/**
 * Lấy số lượng bình luận chờ duyệt (PENDING)
 */
export async function getPendingCommentsCount(): Promise<number> {
    try {
        connectToDatabase();
        
        const count = await Comment.countDocuments({
            status: "PENDING"
        });
        
        return count;
    } catch (error) {
        console.error("Error fetching pending comments count:", error);
        return 0;
    }
}

/**
 * Lấy chi tiết các đơn hàng chờ duyệt (dùng cho dashboard)
 */
export async function getPendingOrders(limit: number = 5) {
    try {
        connectToDatabase();
        
        const orders = await Order.find({
            status: EOrderStatus.PENDING
        })
            .sort({ created_at: -1 })
            .limit(limit)
            .populate({
                path: "course",
                select: "title"
            })
            .populate({
                path: "user",
                select: "name email"
            });
        
        return orders;
    } catch (error) {
        console.error("Error fetching pending orders:", error);
        return [];
    }
}

/**Lấy chi tiết các bình luận chờ duyệt (dùng cho dashboard)**/
export async function getPendingComments(limit: number = 5) {
    try {
        connectToDatabase();
        
        const comments = await Comment.find({
            status: "PENDING"
        })
            .sort({ created_at: -1 })
            .limit(limit)
            .populate({
                path: "course",
                select: "title"
            })
            .populate({
                path: "user",
                select: "name avatar"
            });
        
        return comments;
    } catch (error) {
        console.error("Error fetching pending comments:", error);
        return [];
    }
}