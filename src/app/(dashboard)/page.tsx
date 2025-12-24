import { CourseGrid } from "@/components/common";
import CourseItem from "@/components/course/CourseItem";
import Heading from "@/components/typography/Heading";
import { getAllCoursesPublic } from "@/lib/actions/course.actions";
import { getAllCategories } from "@/lib/actions/category.actions";
import { getRecommendedCourses } from "@/lib/actions/recommendation.actions";
import RecommendedCourses from "@/components/recommendation/RecommendedCourses";
import ExploreFilter from "@/components/explore/ExploreFilter";
import Pagination from "@/components/explore/Pagination";

const page = async ({ searchParams }: { 
    searchParams: {
        page?: string;
        search?: string;
        category?: string;
    }
}) => {
    const params = await searchParams;
    const pageNum = parseInt(params.page || "1");
    const search = params.search || "";
    const categorySlug = params.category || "";

    // Lấy các khóa học công khai (13 để check xem có trang tiếp theo)
    const courses = await getAllCoursesPublic({
        page: pageNum,
        limit: 6,
        search,
        categorySlug,
    }) || [];

    // Lấy danh mục
    const categoriesData = await getAllCategories({ limit: 100 }) || [];
    
    // Convert danh mục thành plain objects
    const categories = categoriesData.map(cat => ({
        _id: String(cat._id),
        name: cat.name,
        slug: cat.slug
    }));

    // Kiểm tra xem có trang tiếp theo không
    const hasNextPage = courses.length > 5;
    const displayCourses = courses.slice(0, 6);

    // Lấy khóa học gợi ý (chỉ hiển thị trên trang 1)
    const recommendedCourses = pageNum === 1 ? await getRecommendedCourses(6) : null;

    return (
        <div className="space-y-16">
            {/* Gợi ý khóa học (trang 1) */}
            {/* {recommendedCourses && recommendedCourses.length > 0 && (
                <RecommendedCourses 
                    courses={JSON.parse(JSON.stringify(recommendedCourses))}
                    // title="Khóa học dành cho bạn"
                />
            )} */}

            {/* Filter & Search */}


            {/* Khóa học */}
            <div>
                <Heading>
                    {search ? `Kết quả tìm kiếm: "${search}"` : "Khám phá"}
                </Heading>

                <div>
                    <ExploreFilter 
                        search={JSON.parse(JSON.stringify(search))} 
                        categorySlug={JSON.parse(JSON.stringify(categorySlug))}
                        categories={JSON.parse(JSON.stringify(categories))}
                    />
                </div>
                
                {displayCourses && displayCourses.length > 0 ? (
                    <>
                        <CourseGrid>
                            {displayCourses.map((course) => (
                                <CourseItem key={course.slug} data={course}/>
                            ))}  
                        </CourseGrid>

                        {/* Pagination */}
                        <Pagination 
                            currentPage={pageNum}
                            hasNextPage={hasNextPage}
                            search={search}
                            categorySlug={categorySlug}
                        />
                    </>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-lg">Không tìm thấy khóa học nào</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default page;