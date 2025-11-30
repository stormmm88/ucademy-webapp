import LessonContent from "@/components/lesson/LessonContent";
import { getCourseBySlug } from "@/lib/actions/course.actions";
import { getHistory } from "@/lib/actions/history.actons";
import { countLessonByCourseId } from "@/lib/actions/lesson.actions";

const page = async ({ params, searchParams }: {params: {course : string}; searchParams: {slug: string}}) => {

    const { course } = await params;
    const { slug } = await searchParams;
    const findCourse = await getCourseBySlug({ slug: course});
    if(!findCourse) return <div>Khóa học không tồn tại</div>;
    const courseId = findCourse?._id.toString();
    const lectures = findCourse.lectures || [];
    const histories = await getHistory({ course: courseId });
    const countLesson  = await countLessonByCourseId({ courseId })
    const completePercentage = ((histories?.length || 0) / (countLesson|| 1)) * 100;

    return (
        <div className="sticky top-5 right-0 max-h-[calc(100svh - 100px)] overflow-y-auto">
            <div className="h-3 w-full rounded-full border border-gray-200 bg-white mb-2">
                <div className="w-0 h-full rounded-full bg-pri transition-all duration-100"
                style={{ width: `${completePercentage}%`}}
                ></div>
            </div>
            <LessonContent 
                lectures={lectures} 
                course={course} 
                slug={slug} 
                histories = { histories ? JSON.parse(JSON.stringify(histories)): []}
            />
        </div>
    )
}

export default page;