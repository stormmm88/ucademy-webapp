import Heading from '@/components/typography/Heading';
import { UpdateCouponPage } from '@/modules/coupon/pages';

export interface UpdateCouponPageRootProps {
  searchParams: {
    code: string;
  };
}

function UpdateCouponPageRoot({ searchParams }: UpdateCouponPageRootProps) {
  return (
    <>
      <Heading>Cập nhật mã giảm giá</Heading>
      <UpdateCouponPage code={searchParams.code} />;
    </>
  );
}

export default UpdateCouponPageRoot;