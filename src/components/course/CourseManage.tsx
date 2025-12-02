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
import Image from "next/image";
import { commonClassNames, courseStatus } from "@/constants";
import { cn } from "@/lib/utils";
import { IconDel, IconEdit, IconEye, IconLeftArrow, IconRightArrow, IconStudy } from "../Icons";
import Link from "next/link";
import { ICourse } from "@/database/course.model";
import Swal from 'sweetalert2'
import { updateCourse } from "@/lib/actions/course.actions";
import { ECourseStatus } from "@/types/enums";
import { toast } from "react-toastify";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useEffect, useState } from "react";
import { usePathname, useRouter, } from "next/navigation";
import { debounce } from "lodash"
import useQueryString from "@/hooks/useQueryString";


const CourseManage = ({ courses}: {courses: ICourse[]}) => {

    const router = useRouter()
    const pathname = usePathname()
    
    const { createQueryString} = useQueryString()

    const handleDelCourse = ( slug: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then( async (result) => {
            if (result.isConfirmed) {
                await updateCourse({
                    slug,
                    updateData: {
                        status: ECourseStatus.PENDING,
                        _destroy: true,
                    },
                    path: '/manage/courses'
                });
                toast.success('Xóa khóa học thành công!!')
            }
        });
    };

    const handleChangeStatus = (slug: string, status: ECourseStatus) => {
        try {
            Swal.fire({
            title: "Bạn có chắc chắn không ?",
            text: "Trạng thái sẽ được thay đổi",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Cập nhật",
            cancelButtonText: "Không"
            }).then( async (result) => {
                if (result.isConfirmed) {
                    await updateCourse({
                        slug,
                        updateData: {
                            status: status === ECourseStatus.PENDING ? ECourseStatus.APPROVED : ECourseStatus.PENDING,
                            _destroy: false,
                        },
                        path: '/manage/courses'
                    });
                    toast.success('Cập nhật trạng thái thành công!!')
                    router.push(`${pathname}`)

                }
            });
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchCourse = debounce ((e: React.ChangeEvent<HTMLInputElement>) => {
        router.push(`${pathname}?${createQueryString('search', e.target.value)}`)
    }, 500)

    const handleSearchStatus = (status: ECourseStatus) => {
        router.push(`${pathname}?${createQueryString('status', status)}`)
    }

    const [ page, setPage] = useState(1);

    const handleChangePage = (type: "prev" | "next", page: number) => {
        if(type === "prev" && page === 1) return null;
        if(type === "prev") return setPage((prev) => prev - 1);
        if(type === "next") return setPage((prev) => prev + 1);
    }

    useEffect(() => {
        router.push(`${pathname}?${createQueryString('page', page.toString())}`)
    }, [page])

    return (
        <div>

            <Link href="/manage/courses/create" className="size-10 rounded-full bg-gradient-to-br from-[#112d60] to-[#dd83e0] flex items-center justify-center fixed right-5 bottom-5 animate-bounce text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </Link>

            <div className="flex flex-col md:flex-row lg:items-center justify-between mb-10">
                <Heading>Quản lý khóa học</Heading>
                <div className="flex gap-3">
                    <div className="w-full md:w-[300px]">
                        <Input 
                            placeholder="Tìm kiếm khóa học ..." 
                            className="border-pri/50"
                            onChange={(e) => handleSearchCourse(e)}
                        />
                    </div>
                    <Select
                        onValueChange={(value) => handleSearchStatus(value as ECourseStatus)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {courseStatus.map((status) => (
                                    <SelectItem value={status.value} key={status.value}>{status.title}</SelectItem>
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
                    <TableHead>Giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {courses.length > 0 && courses.map((course) => (
                    <TableRow key={course.slug}>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Image 
                                    alt=""
                                    src= {course.image}
                                    width={80}
                                    height={80}
                                    className="flex-shrink-0 size-16 object-cover rounded-lg"
                                />
                                <div className="flex flex-col gap-1">
                                    <h3 className="font-bold text-sm lg:text-base whitespace-nowrap">{course.title}</h3>
                                    <h4 className="text-xs lg:text-sm text-slate-500">{new Date(course.created_at).toLocaleDateString('vi-VI')}</h4>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className="font-bold text-sm lg:text-base">{(course.sale_price).toLocaleString()}Đ</span>
                        </TableCell>
                        <TableCell>
                            <button 
                                type="button"
                                className={cn(commonClassNames.status,courseStatus.find((item) => item.value === course.status)?.className)}
                                onClick={() => handleChangeStatus(course.slug, course.status)}    
                            >
                                {courseStatus.find((item) => item.value === course.status)?.title}
                            </button>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Link 
                                    href={`/manage/courses/update-content?slug=${course.slug}`}
                                    target="_blank"
                                    className={commonClassNames.action}>
                                    <IconStudy className="size-4"/>
                                </Link>

                                <Link 
                                    href={`/course/${course.slug}`}
                                    target="_blank"
                                    className={commonClassNames.action}>
                                    <IconEye className="size-4"/>
                                </Link>

                                <Link 
                                    href={`/manage/courses/update?slug=${course.slug}`}
                                    target="_blank"
                                    className= {commonClassNames.action}>
                                    <IconEdit className="size-4"/>
                                </Link>

                                <button 
                                    onClick={() => handleDelCourse(course.slug)}
                                    className={commonClassNames.action}
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
                    <IconLeftArrow  
                        className="size-6"
                    />
                </button>
                <button 
                    className="flex items-center justify-center size-10 border rounded-md hover:border-pri transitions-all hover:text-pri border-gray-300 cursor-pointer"
                    onClick={() => handleChangePage("next", page)}    
                >
                    <IconRightArrow 
                        className="size-6"
                    />
                </button>
            </div>
        </div>
    )
}

export default CourseManage;
