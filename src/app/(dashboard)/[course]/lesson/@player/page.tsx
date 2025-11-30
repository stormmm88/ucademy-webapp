import { getCourseBySlug } from "@/lib/actions/course.actions";
import LessonSaveUrl from "../LessonSaveUrl";
import { findAllLessons } from "@/lib/actions/lesson.actions";
import LessonNavigation from "../lessonNavigation";
import Heading from "@/components/typography/Heading";


const page = async ({ params, searchParams }: {params: {course : string}; searchParams: {slug: string}}) => {

    const { course } = await params;
    const { slug } = await searchParams;

    const findCourse = await getCourseBySlug({ slug: course});
    if(!findCourse) return <div>Khóa học không tồn tại</div>;
    const courseId = findCourse?._id.toString();

    const lessonList = await findAllLessons({ course: courseId || ""});
    const lessonDetail = lessonList?.find((el) => el.slug === slug);
    if(!lessonDetail) return <div>Bài học không tồn tại</div>;
    const currentLessonIndex = lessonList?.findIndex((el) => el.slug === slug) || 0;
    let nextLesson = lessonList?.[currentLessonIndex + 1];  
    let prevLesson = lessonList?.[currentLessonIndex - 1];

    nextLesson = nextLesson ? JSON.parse(JSON.stringify(nextLesson)) : null;
    prevLesson = prevLesson ? JSON.parse(JSON.stringify(prevLesson)) : null;
    const videoId = lessonDetail.video_url?.split("v=").at(-1);

    return (
        <div >
            <LessonSaveUrl 
                url={`/${course}/lesson?slug=${slug}`}
                course={course}
            />
            <div className="relative mb-5 aspect-video rounded-lg">
                <iframe 
                    className="w-full h-full object-fill"
                    src= {`https://www.youtube.com/embed/${videoId}`}   
                >
                </iframe>
            </div>
            <div className="flex items-center justify-between mb-5">
                <LessonNavigation
                    prevLesson={!prevLesson ? '' : `/${course}/lesson?slug=${prevLesson?.slug}`}
                    nextLesson={!nextLesson ? '' : `/${course}/lesson?slug=${nextLesson?.slug}`}
                />
            </div> 
            <Heading>{lessonDetail.title}</Heading>

            <div className="p-5 rounded-lg bg-white border border-gray-200 entry-content">
                <div dangerouslySetInnerHTML={{__html: lessonDetail.content || "Chưa có nội dung"}}></div>
            </div>
        </div>
    )
}

export default page;