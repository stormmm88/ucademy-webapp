/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Heading from "../typography/Heading";
import { IconDel, IconEdit, IconLeftArrow, IconRightArrow } from "../Icons";
import Swal from 'sweetalert2'
import { Input } from "../ui/input";
import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import useQueryString from "@/hooks/useQueryString";
import { commonClassNames } from "@/constants";
import { cn } from "@/lib/utils";
import { deleteCategory } from "@/lib/actions/category.actions";
import { toast } from "react-toastify";
import Link from "next/link";
// import { Button } from "../ui/button";
import { ICategory } from "@/database/category.model";

const CategoryManage = ({ categories = [] }: { categories: ICategory[] }) => {

    const { createQueryString, router, pathname } = useQueryString();

    const handleDeleteCategory = (categoryId: string) => {
        Swal.fire({
            title: "Bạn có chắc chắn xóa danh mục này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Thoát",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await deleteCategory(categoryId, pathname);
                if (res?.success) {
                    toast.success(res.message);
                    router.refresh();
                } else {
                    toast.error(res?.message || "Có lỗi xảy ra");
                }
            }
        });
    };

    const handleSearchCategory = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        router.push(`${pathname}?${createQueryString('search', e.target.value)}`);
    }, 500);

    const [page, setPage] = useState(1);

    const handleChangePage = (type: "prev" | "next", page: number) => {
        if (type === "prev" && page === 1) return null;
        if (type === "prev") return setPage((prev) => prev - 1);
        if (type === "next") return setPage((prev) => prev + 1);
    };

    useEffect(() => {
        router.push(`${pathname}?${createQueryString('page', page.toString())}`);
    }, [page]);

    return (
        <div>
            <Link href="/manage/categories/create" className="size-10 rounded-full bg-gradient-to-br from-[#112d60] to-[#dd83e0] flex items-center justify-center fixed right-5 bottom-5 animate-bounce text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </Link>

            <div className="flex flex-col md:flex-row lg:items-center justify-between mb-10">
                <Heading>Quản lý danh mục</Heading>
                <div className="w-full md:w-[300px]">
                    <Input
                        placeholder="Tìm kiếm danh mục ..."
                        className="border-pri/50"
                        onChange={(e) => handleSearchCategory(e)}
                    />
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tên danh mục</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length > 0 && categories.map((category) => (
                        <TableRow key={String(category._id)}>
                            <TableCell>
                                <h3 className="font-bold">{category.name}</h3>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-slate-500">{category.slug}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm">
                                    {new Date(category.created_at).toLocaleDateString('vi-VN')}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/manage/categories/update?id=${category._id}`}
                                        className={commonClassNames.action}>
                                        <IconEdit className="size-4" />
                                    </Link>

                                    <button
                                        onClick={() => handleDeleteCategory(String(category._id))}
                                        className={cn(commonClassNames.action, "text-red-500")}
                                    >
                                        <IconDel className="size-4" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {categories.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                    Chưa có danh mục nào
                </div>
            )}

            <div className="flex justify-end gap-3 mt-5">
                <button
                    className="flex items-center justify-center size-10 border rounded-md hover:border-pri transitions-all hover:text-pri border-gray-300 cursor-pointer"
                    onClick={() => handleChangePage("prev", page)}
                >
                    <IconLeftArrow className="size-6" />
                </button>
                <button
                    className="flex items-center justify-center size-10 border rounded-md hover:border-pri transitions-all hover:text-pri border-gray-300 cursor-pointer"
                    onClick={() => handleChangePage("next", page)}
                >
                    <IconRightArrow className="size-6" />
                </button>
            </div>
        </div>
    );
};

export default CategoryManage;