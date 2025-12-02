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
import { commonClassNames, courseStatus, orderStatus } from "@/constants";
import Swal from 'sweetalert2'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import React, { useEffect, useState } from "react";
import Heading from "@/components/typography/Heading";
import { Input } from "@/components/ui/input";
import { IconCheck, IconLeftArrow, IconRightArrow, IconX} from "@/components/Icons";
import { cn } from "@/lib/utils";
import { EOrderStatus } from "@/types/enums";
import useQueryString from "@/hooks/useQueryString";
import { debounce } from "lodash";
import { updateOrder } from "@/lib/actions/order.actions";
import { toast } from "react-toastify";

interface IOrderManageProps {
    _id: string;
    code: string;
    course: {
        title: string,
    },
    total: number,
    amount: number,
    discount: number,
    status: EOrderStatus,
    user: {
        name: string,
    }
}

const OrderManage = ({orders = []}: {orders: IOrderManageProps[]}) => {

    const handleUpdateOrder = async ({orderId, status}: {orderId:string, status: EOrderStatus}) => {
        if(status === EOrderStatus.CANCELED){
            Swal.fire({
                title: "Bạn có chắc chắn huy đơn hàng không",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Thoát",
            }).then( async (result) => {
                if (result.isConfirmed) {
                    await updateOrder({ orderId, status})
                }
            });
        }
        if(status === EOrderStatus.COMPLETED){
            const res = await updateOrder({ orderId, status})
            if(res?.success){
                toast.success("Cập nhật đơn hàng thành không")
            }
        }
    };

    // const handleCompleteOrder = () => {
        
    // }

    const {createQueryString, router, pathname } = useQueryString();

    const handleSearchOrder = debounce ((e: React.ChangeEvent<HTMLInputElement>) => {
        router.push(`${pathname}?${createQueryString('search', e.target.value)}`)
    }, 500)

    const handleSearchStatus = (status: EOrderStatus) => {
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
            <div className="flex flex-col md:flex-row lg:items-center justify-between mb-10">
                <Heading>Quản lý đơn hàng</Heading>
                <div className="flex gap-3">
                    <div className="w-full md:w-[300px]">
                        <Input 
                            placeholder="Tìm kiếm mã đơn hàng ..." 
                            className="border-pri/50"
                            onChange={(e) => handleSearchOrder(e)}
                        />
                    </div>
                    <Select
                        onValueChange={(value) => handleSearchStatus(value as EOrderStatus)}
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
                    <TableHead>Mã đơn hàng</TableHead>
                    <TableHead>Khóa học</TableHead>
                    <TableHead>Thành viên</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Mã giảm giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length > 0 && orders.map((order) => (
                        <TableRow key={order.code}>
                            <TableCell><strong>{order.code}</strong></TableCell>
                            <TableCell>{order.course.title}</TableCell>
                            <TableCell>{order.user.name}</TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-2">
                                    {(order.amount).toLocaleString("vi-VN")}₫
                                    {order.discount > 0 && <span>{order.discount}</span>}
                                    <strong
                                        className={cn(orderStatus.find((item) => item.value === order.status)?.className, "bg-transparent")}
                                    >{(order.total).toLocaleString("vi-VN")}₫</strong>
                                </div>
                            </TableCell>
                            <TableCell>
                                
                            </TableCell>
                            <TableCell>
                                <span 
                                    className={cn(commonClassNames.status,orderStatus.find((item) => item.value === order.status)?.className)}
                                    // onClick={() => handleChangeStatus(course.slug, course.status)}    
                                >
                                    {orderStatus.find((item) => item.value === order.status)?.title}
                                </span>
                            </TableCell>
                            <TableCell>
                                {order.status !== EOrderStatus.CANCELED && (    
                                    <div className="flex gap-2">
                                        {order.status !== EOrderStatus.COMPLETED && (
                                            <button
                                                type="button"
                                                className= {commonClassNames.action}
                                                onClick={() => handleUpdateOrder({orderId: order._id, status: EOrderStatus.COMPLETED})}    
                                            >
                                                <IconCheck className="size-4"/>
                                                
                                            </button>
                                        )}
        
                                        <button 
                                            type="button"
                                            className={commonClassNames.action}
                                            onClick={() => handleUpdateOrder({orderId: order._id, status: EOrderStatus.CANCELED})}
                                        >
                                            <IconX className="size-4"/>
                                        </button>
                                    </div>
                                )}
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

export default OrderManage;
