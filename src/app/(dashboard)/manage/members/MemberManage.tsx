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
import { IconDel, IconEdit, IconLeftArrow, IconRightArrow } from "@/components/Icons";
import { IUser } from "@/database/user.model";
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
import { EUserRole, EUserStatus } from "@/types/enums";
import { updateUser } from "@/lib/actions/user.actions";
import { toast } from "react-toastify";

const userStatus = [
    { title: "Hoạt động", value: EUserStatus.ACTVE, className: "text-green-500" },
    { title: "Không hoạt động", value: EUserStatus.UNACTIVE, className: "text-orange-500" },
    { title: "Bị cấm", value: EUserStatus.BANNED, className: "text-red-500" }
];

const userRole = [
    { title: "Người dùng", value: EUserRole.USER },
    { title: "Admin", value: EUserRole.ADMIN },
    { title: "Chuyên gia", value: EUserRole.EXPERT }
];

const MemberManage = ({ users = [] }: { users: IUser[] }) => {

    const { createQueryString, router, pathname } = useQueryString();

    const handleDeleteUser = (userId: string) => {
        Swal.fire({
            title: "Bạn có chắc chắn xóa người dùng này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Thoát",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await updateUser({
                        userId,
                        updateData: {
                            status: EUserStatus.BANNED
                        }
                    });
                    toast.success("Cấm người dùng thành công!");
                    router.refresh();
                } catch (error) {
                    console.log(error);
                    toast.error("Có lỗi xảy ra!");
                }
            }
        });
    };

    const handleChangeStatus = async (userId: string, currentStatus: EUserStatus) => {
        try {
            const newStatus = currentStatus === EUserStatus.ACTVE 
                ? EUserStatus.UNACTIVE 
                : EUserStatus.ACTVE;

            Swal.fire({
                title: "Bạn có chắc chắn thay đổi trạng thái không?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Thoát",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await updateUser({
                        userId,
                        updateData: {
                            status: newStatus
                        }
                    });
                    toast.success("Cập nhật trạng thái thành công!");
                    router.refresh();
                }
            });
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra!");
        }
    };

    const handleChangeRole = async (userId: string, newRole: EUserRole) => {
        try {
            await updateUser({
                userId,
                updateData: {
                    role: newRole
                }
            });
            toast.success("Cập nhật vai trò thành công!");
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra!");
        }
    };

    const handleSearchMember = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        router.push(`${pathname}?${createQueryString('search', e.target.value)}`);
    }, 500);

    const handleSearchStatus = (status: EUserStatus) => {
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

    return (
        <div>
            <div className="flex flex-col md:flex-row lg:items-center justify-between mb-10">
                <Heading>Quản lý thành viên</Heading>
                <div className="flex gap-3">
                    <div className="w-full md:w-[300px]">
                        <Input 
                            placeholder="Tìm kiếm thành viên..." 
                            className="border-pri/50"
                            onChange={(e) => handleSearchMember(e)}
                        />
                    </div>
                    <Select
                        onValueChange={(value) => handleSearchStatus(value as EUserStatus)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {userStatus.map((status) => (
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
                        <TableHead>Thông tin</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Vai trò</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày tham gia</TableHead>
                        <TableHead>Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length > 0 && users.map((user) => (
                        <TableRow key={String(user._id)}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {/* <Image 
                                        alt={user.name}
                                        src={user.avatar || "/default-avatar.png"}
                                        width={40}
                                        height={40}
                                        className="flex-shrink-0 size-10 object-cover rounded-full"
                                    /> */}
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-bold text-sm lg:text-base whitespace-nowrap">
                                            {user.name}
                                        </h3>
                                        <h4 className="text-xs lg:text-sm text-slate-500">
                                            @{user.username}
                                        </h4>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm">{user.email}</span>
                            </TableCell>
                            <TableCell>
                                <Select
                                    value={user.role}
                                    onValueChange={(value) => handleChangeRole(String(user._id), value as EUserRole)}
                                >
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {userRole.map((role) => (
                                                <SelectItem value={role.value} key={role.value}>
                                                    {role.title}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <button 
                                    type="button"
                                    className={cn(
                                        commonClassNames.status,
                                        userStatus.find((item) => item.value === user.status)?.className
                                    )}
                                    onClick={() => handleChangeStatus(String(user._id), user.status)}
                                >
                                    {userStatus.find((item) => item.value === user.status)?.title}
                                </button>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm">
                                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <button 
                                        type="button"
                                        className={cn(commonClassNames.action, "text-red-500")}
                                        onClick={() => handleDeleteUser(String(user._id))}
                                    >
                                        <IconDel className="size-4"/>
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

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

export default MemberManage;