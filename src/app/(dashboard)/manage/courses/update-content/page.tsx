import CourseUpdateContent from "@/components/course/CourseUpdateContent";
import Heading from "@/components/typography/Heading";
import { getCourseBySlug } from "@/lib/actions/course.actions";

const page = async ({ searchParams }: { searchParams: { slug: string } }) => {
    const { slug } = await searchParams; 

    //B1.Lấy khóa học bằng slug
    const findCourse = await getCourseBySlug({ slug: searchParams.slug })
    if(!findCourse) return <div>Không tìm thấy khóa học</div>
    return (
        <>
            <Heading>Nội dung: <strong className="text-pri">{findCourse.title}</strong></Heading>

            {/* B2. làm UI trang thêm nội dung khóa học */}
            <CourseUpdateContent course={JSON.parse(JSON.stringify(findCourse))}>
            </CourseUpdateContent>
        </>
    )
}

export default page;