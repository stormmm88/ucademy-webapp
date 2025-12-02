import { getOrderDetails } from "@/lib/actions/order.actions";

const OrderDetails = async ({params}: {params: {code: string}}) => {

    const orderDetails = await getOrderDetails({
        code: params.code
    })

    return (
        <div>
            <p>Cám ơn bạn đã mua khóa học <strong className=" text-pri">{orderDetails.course.title}</strong>{" "}
                với số tiền là {" "} <strong className="text-pri">{(orderDetails.total).toLocaleString("vi-VN")}</strong>
            </p>
        </div>
    )
}

export default OrderDetails;