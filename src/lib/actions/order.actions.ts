/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { TCreateOrderParams } from "@/types";
import { connectToDatabase } from "../mongoose";
import Order from "@/database/order.model";
import Course from "@/database/course.model";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";
import { EOrderStatus } from "@/types/enums";
import { revalidatePath } from "next/cache";

//Fetching
export async function getAllOrders(params: any) {
    try {
        connectToDatabase();

        const { page = 1, limit = 10, search, status} = params || {};
        const skip = (page -1) * limit;
        const query: FilterQuery<typeof Course> = {};
        if(search){
            query.$or = [{ code: {$regex: search, $options: "i"} }];
        }
        if(status){
            query.status = status
        }

        const orders = await Order.find(query).skip(skip).limit(limit).populate({
            model: Course,
            path: "course",
            select: "title",
        }).populate({
            model: User,
            select: "name",
            path: 'user',
        });
        return orders;
    } catch (error) {
        console.log(error)
    }
}

export async function createOrder(params: TCreateOrderParams) {
    try {
        connectToDatabase();
        const newOrder = await Order.create(params);
        return JSON.parse(JSON.stringify(newOrder));
    } catch (error) {
        console.log(error)
    }
}

export async function updateOrder({orderId, status}: {orderId: string; status: EOrderStatus}){
    try {
        connectToDatabase();
        const findOrder = await Order.findById(orderId).populate({
            model: Course,
            path: "course",
            select: "_id"
        }).populate({
            model: User,
            path: "user",
            select: "_id"
        });
        if(!findOrder) return;
        if(findOrder.status === EOrderStatus.CANCELED) return;
        const findUser = await User.findById(findOrder.user._id)
        
        await Order.findByIdAndUpdate(orderId, {
            status,
        })

        if(status === EOrderStatus.COMPLETED && findOrder.status === EOrderStatus.PENDING){
            //add course for user
            findUser.courses.push(findOrder.course._id);
            await findUser.save();
        }

        if(status === EOrderStatus.CANCELED && findOrder.status === EOrderStatus.COMPLETED){
            //add course for user
            findUser.courses = findUser.courses.filter((el: any) => el.toString() !== findOrder.course._id.toString());
            await findUser.save();
        }
        
        revalidatePath("/manage/order")
        return {
            success: true,
        }
    } catch (error) {
        console.log(error);
    }
}

export async function getOrderDetails({code}: {code:string}){
    try {
        connectToDatabase();
        const order = await Order.findOne({
            code,
        }).populate({
            path: "course",
            select: "title"
        })
        return JSON.parse(JSON.stringify(order));
    } catch (error) {
        console.log(error);
    }
}