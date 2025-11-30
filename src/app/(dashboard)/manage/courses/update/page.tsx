import CourseUpdate from "@/components/course/CourseUpdate";
import Heading from "@/components/typography/Heading";
import { getCourseBySlug } from "@/lib/actions/course.actions";

const page = async ({ searchParams }: { searchParams: { slug: string } }) => {
    const { slug } = await searchParams;
    const findCourse = await getCourseBySlug({ slug });
    if (!findCourse) {
        return <div>Khóa học không tồn tại</div>;
    }
    return (
        <>
            <Heading>Cập nhật khóa học</Heading>
            <CourseUpdate data={JSON.parse(JSON.stringify(findCourse))}/>
        </>
    )
}
export default page;