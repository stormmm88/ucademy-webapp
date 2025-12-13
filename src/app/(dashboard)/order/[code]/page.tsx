import { getOrderDetails } from "@/lib/actions/order.actions";
import { CheckCircle, Banknote } from "lucide-react"; // Thêm icon Banknote

// Hàm tiện ích để định dạng tiền tệ
const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND", // Giả sử đơn vị tiền tệ là Việt Nam Đồng
        minimumFractionDigits: 0,
    });
};

const BANK_ACCOUNT_INFO = {
    bankName: "Ngân hàng Techcombank",
    accountNumber: "1903xxxxxxxxxx", // THAY THẾ bằng STK thực tế của bạn
    accountHolder: "CÔNG TY TNHH VIEDLAB", // THAY THẾ bằng Tên chủ tài khoản
};

const OrderDetails = async ({ params }: { params: { code: string } }) => {
    // 1. Fetch dữ liệu đơn hàng
    const orderDetails = await getOrderDetails({
        code: params.code,
    });

    // Xử lý trường hợp không tìm thấy đơn hàng (tùy chọn)
    if (!orderDetails) {
        return (
            <div className="container mx-auto p-4 max-w-2xl">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h1>
                <p className="text-gray-700">Không tìm thấy chi tiết đơn hàng với mã: **{params.code}**</p>
            </div>
        );
    }

    // Lấy mã đơn hàng để sử dụng trong nội dung chuyển khoản
    const orderCode = orderDetails.code;
    const totalAmount = orderDetails.total;

    // 2. Render chi tiết đơn hàng
    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <div className="bg-white shadow-lg rounded-lg p-8">
                {/* Header Xác nhận */}
                <div className="text-center mb-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-extrabold text-gray-800">🎉 Đơn hàng đã được nhận!</h1>
                </div>

                {/* --- Thông tin Thanh toán và Xét duyệt --- */}
                <div className="border border-dashed border-gray-300 p-6 rounded-lg mb-8 bg-blue-50">
                    <h2 className="text-2xl font-bold text-blue-700 flex items-center mb-4">
                        <Banknote className="w-6 h-6 mr-2" />
                        Hướng dẫn Thanh toán
                    </h2>

                    {/* Thông tin chuyển khoản */}
                    <div className="space-y-3 bg-white p-4 rounded-md shadow-inner">
                        <p className="text-gray-700">
                            **Vui lòng chuyển khoản chính xác số tiền:** <br />
                            <strong className="text-red-600 text-3xl font-extrabold block">
                                {formatCurrency(totalAmount)}
                            </strong>
                        </p>
                        
                        <div className="border-t border-dashed pt-3">
                            <p className="text-md text-gray-700">
                                Ngân hàng: <strong className="font-semibold">{BANK_ACCOUNT_INFO.bankName}</strong>
                            </p>
                            <p className="text-md text-gray-700">
                                Số tài khoản: <strong className="font-semibold text-blue-600">{BANK_ACCOUNT_INFO.accountNumber}</strong>
                            </p>
                            <p className="text-md text-gray-700">
                                Chủ tài khoản: <strong className="font-semibold">{BANK_ACCOUNT_INFO.accountHolder}</strong>
                            </p>
                        </div>
                    </div>

                    {/* Yêu cầu Nội dung chuyển khoản */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 mt-6" role="alert">
                        <p className="font-bold mb-1">⚠️ Nội dung chuyển khoản BẮT BUỘC:</p>
                        <p className="text-lg">
                            Hãy ghi chính xác mã đơn hàng sau vào nội dung chuyển khoản để hệ thống tự động xác nhận:
                        </p>
                        <strong className="text-red-700 text-2xl bg-yellow-200 p-1 rounded inline-block mt-2 tracking-wider">
                            {orderCode}
                        </strong>
                    </div>

                    {/* Thông báo Xét duyệt */}
                    <p className="mt-4 text-gray-600 italic">
                        Sau khi nhận được chuyển khoản với nội dung chính xác, đơn hàng của bạn sẽ được xét duyệt trong vòng **12 giờ tới**.
                    </p>
                </div>
                {/* --- Hết Thông tin Thanh toán và Xét duyệt --- */}

                {/* Chi tiết khóa học */}
                <div className="space-y-4 border-t border-gray-200 pt-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Chi tiết đơn hàng</h2>
                    <p className="text-lg text-gray-700">
                        Cám ơn bạn đã mua khóa học: <br />
                        <strong className="text-pri text-2xl font-bold">
                            {orderDetails.course.title}
                        </strong>
                    </p>
                    <p className="text-md text-gray-500 pt-2">
                        Mã đơn hàng của bạn: <span className="font-mono text-gray-600">**{orderCode}**</span>
                    </p>
                </div>

                {/* Footer hướng dẫn */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                        Vui lòng kiểm tra email của bạn thường xuyên. Nếu có bất kỳ thắc mắc nào, xin liên hệ Bộ phận Hỗ trợ.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;