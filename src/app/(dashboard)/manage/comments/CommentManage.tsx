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
import Heading from "@/components/typography/Heading";
import Image from "next/image";
import { IconDel, IconLeftArrow, IconRightArrow, IconStar } from "@/components/Icons";
import Swal from 'sweetalert2'
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import useQueryString from "@/hooks/useQueryString";
import { commonClassNames } from "@/constants";
import { cn } from "@/lib/utils";
import { IComment } from "@/database/comment.model";
import { updateComment, deleteComment } from "@/lib/actions/comment.actions";
import { toast } from "react-toastify";

const commentStatus = [
    { title: "Đã duyệt", value: "APPROVED", className: "text-green-500" },
    { title: "Chờ duyệt", value: "PENDING", className: "text-orange-500" },
    { title: "Từ chối", value: "REJECTED", className: "text-red-500" }
];

interface ICommentWithUser extends Omit<IComment, 'user' | 'course'> {
    user: {
        _id: string;
        name: string;
        avatar: string;
        email: string;
    };
    course: {
        _id: string;
        title: string;
        image: string;
    };
}

const CommentManage = ({ comments = [] }: { comments: ICommentWithUser[] }) => {

    const { createQueryString, router, pathname } = useQueryString();

    const handleDeleteComment = (commentId: string) => {
        Swal.fire({
            title: "Bạn có chắc chắn xóa bình luận này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Thoát",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await deleteComment(commentId, pathname);
                if (res?.success) {
                    toast.success(res.message);
                    router.refresh();
                } else {
                    toast.error(res?.message || "Có lỗi xảy ra");
                }
            }
        });
    };

    const handleChangeStatus = async (commentId: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === "APPROVED" ? "REJECTED" : "APPROVED";

            Swal.fire({
                title: "Bạn có chắc chắn thay đổi trạng thái không?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Thoát",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const res = await updateComment({
                        commentId,
                        updateData: {
                            status: newStatus as "APPROVED" | "PENDING" | "REJECTED"
                        },
                        path: pathname
                    });
                    
                    if (res?.success) {
                        toast.success(res.message);
                        router.refresh();
                    } else {
                        toast.error(res?.message || "Có lỗi xảy ra");
                    }
                }
            });
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra!");
        }
    };

    const handleSearchComment = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        router.push(`${pathname}?${createQueryString('search', e.target.value)}`);
    }, 500);

    const handleSearchStatus = (status: string) => {
        router.push(`${pathname}?${createQueryString('status', status)}`);
    };

    const [page, setPage] = useState(1);

    const handleChangePage = (type: "prev" | "next", page: number) => {
        if (type === "prev" && page === 1) return null;
        if (type === "prev") return setPage((prev) => prev - 1);
        if (type === "next") return setPage((prev) => prev + 1);
    };

    useEffect(() => {
        router.push(`${pathname}?${createQueryString('page', page.toString())}`);
    }, [page]);

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, index) => (
                    <IconStar
                        key={index}
                        className={cn(
                            "size-4",
                            index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        )}
                    />
                ))}
            </div>
        );
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row lg:items-center justify-between mb-10">
                <Heading>Quản lý bình luận</Heading>
                <div className="flex gap-3">
                    <div className="w-full md:w-[300px]">
                        <Input 
                            placeholder="Tìm kiếm bình luận..." 
                            className="border-pri/50"
                            onChange={(e) => handleSearchComment(e)}
                        />
                    </div>
                    <Select
                        onValueChange={(value) => handleSearchStatus(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {commentStatus.map((status) => (
                                    <SelectItem value={status.value} key={status.value}>
                                        {status.title}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Người dùng</TableHead>
                        <TableHead>Khóa học</TableHead>
                        <TableHead>Nội dung</TableHead>
                        <TableHead>Đánh giá</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {comments.length > 0 && comments.map((comment) => (
                        <TableRow key={comment._id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Image 
                                        alt={comment.user.name}
                                        src={comment.user.avatar || "/default-avatar.png"}
                                        width={40}
                                        height={40}
                                        className="flex-shrink-0 size-10 object-cover rounded-full"
                                    />
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-bold text-sm whitespace-nowrap">
                                            {comment.user.name}
                                        </h3>
                                        <h4 className="text-xs text-slate-500">
                                            {comment.user.email}
                                        </h4>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Image 
                                        alt={comment.course.title}
                                        src={comment.course.image}
                                        width={60}
                                        height={40}
                                        className="flex-shrink-0 w-[60px] h-10 object-cover rounded"
                                    />
                                    <span className="text-sm font-medium line-clamp-2 max-w-[200px]">
                                        {comment.course.title}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p className="text-sm line-clamp-3 max-w-[300px]">
                                    {comment.content}
                                </p>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1">
                                    {renderStars(comment.rating)}
                                    <span className="text-xs text-slate-500">
                                        {comment.rating}/5
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <button 
                                    type="button"
                                    className={cn(
                                        commonClassNames.status,
                                        commentStatus.find((item) => item.value === comment.status)?.className
                                    )}
                                    onClick={() => handleChangeStatus(comment._id, comment.status)}
                                >
                                    {commentStatus.find((item) => item.value === comment.status)?.title}
                                </button>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm">
                                    {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <button 
                                        type="button"
                                        className={cn(commonClassNames.action, "text-red-500")}
                                        onClick={() => handleDeleteComment(comment._id)}
                                    >
                                        <IconDel className="size-4"/>
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {comments.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                    Chưa có bình luận nào
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

export default CommentManage;