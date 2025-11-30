import CourseManage from "@/components/course/CourseManage";
import { getAllCourses } from "@/lib/actions/course.actions";
import { ECourseStatus } from "@/types/enums";

const page = async ({ searchParams }: { searchParams: { page: number; search: string; status: ECourseStatus}}) => {
    const params = await searchParams;
    const courses = await getAllCourses({
        page: params.page || 1,
        limit: 10,
        search: params.search,
        status: params.status,
    });
    return (
        <>
            <CourseManage
                courses = {courses ? JSON.parse(JSON.stringify(courses)) : []}
            >
            </CourseManage>
        </>
    )
}

export default page;