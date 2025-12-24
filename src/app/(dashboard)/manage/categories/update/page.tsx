// src/app/(dashboard)/manage/categories/update/page.tsx
import CategoryUpdate from "@/components/category/CategoryUpdate";
import Heading from "@/components/typography/Heading";
import Category from "@/database/category.model";

const page = async ({ searchParams }: { searchParams: { id: string } }) => {
    const { id } = await searchParams;
    // Thay đổi để lấy by ID
    const category = await Category.findById(id);
    
    if (!category) {
        return <div>Danh mục không tồn tại</div>;
    }

    return (
        <>
            <Heading>Cập nhật danh mục</Heading>
            <CategoryUpdate data={JSON.parse(JSON.stringify(category))}/>
        </>
    );
};

export default page;