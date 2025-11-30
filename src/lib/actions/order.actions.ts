/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { TCreateOrderParams } from "@/types";
import { connectToDatabase } from "../mongoose";
import Order from "@/database/order.model";
import Course from "@/database/course.model";
import User from "@/database/user.model";
import { FilterQuery } from "mongoose";

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