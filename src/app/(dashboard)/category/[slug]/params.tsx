import PageNotFound from "@/app/not-found";
import { CourseGrid } from "@/components/common";
import CourseItem from "@/components/course/CourseItem";
import Heading from "@/components/typography/Heading";
import { getCategoryBySlug } from "@/lib/actions/category.actions";
import { getCoursesByCategory } from "@/lib/actions/recommendation.actions";


const page = async ({ params }: { params: { slug: string } }) => {
    const { slug } = await params;
    
    const category = await getCategoryBySlug(slug);
    if (!category) return <PageNotFound />;

    const courses = await getCoursesByCategory(String(category._id), 12, 1);

    return (
        <>
            <Heading>{`${category.name}`}</Heading>

            {courses && courses.length > 0 ? (
                <CourseGrid>
                    {courses.map((course) => (
                        <CourseItem key={course.slug} data={course} />
                    ))}
                </CourseGrid>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">Chưa có khóa học nào trong danh mục này</p>
                </div>
            )}
        </>
    );
};

export default page;