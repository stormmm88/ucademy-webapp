import { getAllOrders } from "@/lib/actions/order.actions";
import OrderManage from "./OrderManage";
import { EOrderStatus } from "@/types/enums";

const page = async ({ searchParams }: { searchParams: { page: number; search: string; status: EOrderStatus}}) => {
    const params = await searchParams;
    const orders = await getAllOrders({
        page: params.page || 1,
        limit: 0,
        search: params.search,
        status: params.status,
    });
    return (
        <OrderManage orders={orders ? JSON.parse(JSON.stringify(orders)) : []}/>
    )
}

export default page;