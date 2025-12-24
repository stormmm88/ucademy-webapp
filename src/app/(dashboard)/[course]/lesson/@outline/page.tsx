import LessonContent from "@/components/lesson/LessonContent";
import RecommendedCoursesSmall from "@/components/recommendation/RecommendedCourses";
import { getCourseBySlug } from "@/lib/actions/course.actions";
import { getHistory } from "@/lib/actions/history.actons";
import { countLessonByCourseId } from "@/lib/actions/lesson.actions";
import { getRecommendedCourses } from "@/lib/actions/recommendation.actions";

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

    // Lấy khóa học gợi ý
    const recommendedCourses = await getRecommendedCourses(4);

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
            {/* Khóa học gợi ý */}
            {recommendedCourses && recommendedCourses.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                    <RecommendedCoursesSmall courses={JSON.parse(JSON.stringify(recommendedCourses))} />
                </div>
            )}
        </div>
    )
}

export default page;