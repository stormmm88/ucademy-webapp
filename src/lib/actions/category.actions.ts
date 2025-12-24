"use server"

import { connectToDatabase } from "../mongoose";
import Category, { ICategory } from "@/database/category.model";
import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";
import slugify from "slugify";

export type TCreateCategoryParams = {
    name: string;
    slug?: string;
}

export type TUpdateCategoryParams = {
    categoryId: string;
    updateData: Partial<ICategory>;
    path?: string;
}

export type TGetAllCategoryParams = {
    page?: number;
    limit?: number;
    search?: string;
}

export async function createCategory(params: TCreateCategoryParams) {
    try {
        connectToDatabase();
        
        const slug = params.slug || slugify(params.name, {
            lower: true,
            locale: "vi",
        });

        const newCategory = await Category.create({
            name: params.name,
            slug,
        });

        return {
            success: true,
            message: "Tạo danh mục thành công",
            data: JSON.parse(JSON.stringify(newCategory)),
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Có lỗi xảy ra",
        };
    }
}

export async function getAllCategories(params?: TGetAllCategoryParams): Promise<ICategory[] | undefined> {
    try {
        connectToDatabase();
        
        const { page = 1, limit = 10, search } = params || {};
        const skip = (page - 1) * limit;
        const query: FilterQuery<typeof Category> = {
            _destroy: false
        };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { slug: { $regex: search, $options: "i" } }
            ];
        }

        const categories = await Category.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });

        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

export async function getCategoryBySlug(slug: string): Promise<ICategory | undefined> {
    try {
        connectToDatabase();
        
        const category = await Category.findOne({ 
            slug,
            _destroy: false 
        });

        return category;
    } catch (error) {
        console.log(error);
    }
}

export async function updateCategory(params: TUpdateCategoryParams) {
    try {
        connectToDatabase();

        await Category.findByIdAndUpdate(
            params.categoryId,
            params.updateData,
            { new: true }
        );

        if (params.path) {
            revalidatePath(params.path);
        }

        return {
            success: true,
            message: "Cập nhật danh mục thành công",
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Có lỗi xảy ra",
        };
    }
}

export async function deleteCategory(categoryId: string, path?: string) {
    try {
        connectToDatabase();

        await Category.findByIdAndUpdate(
            categoryId,
            { _destroy: true },
            { new: true }
        );

        if (path) {
            revalidatePath(path);
        }

        return {
            success: true,
            message: "Xóa danh mục thành công",
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Có lỗi xảy ra",
        };
    }
}