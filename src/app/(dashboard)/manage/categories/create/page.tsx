// src/app/(dashboard)/manage/categories/create/page.tsx
import CategoryCreate from "@/components/category/CategoryCreate";
import Heading from "@/components/typography/Heading";

const page = () => {
  return (
    <>
        <Heading>Tạo danh mục mới</Heading>
        <CategoryCreate></CategoryCreate>
    </>
  )
}
export default page;