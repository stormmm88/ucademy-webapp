// src/app/(dashboard)/manage/categories/page.tsx
import { getAllCategories } from "@/lib/actions/category.actions";
import CategoryManage from "@/components/category/CategoryManage";

const page = async ({ searchParams }: { 
    searchParams: { 
        page: number; 
        search: string;
    }
}) => {
    const params = await searchParams;
    const categories = await getAllCategories({
        page: params.page || 1,
        limit: 5,
        search: params.search,
    });

    return (
        <CategoryManage categories={categories ? JSON.parse(JSON.stringify(categories)) : []} />
    );
};

export default page;
