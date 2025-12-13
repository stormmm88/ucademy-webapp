import PageNotFound from "@/app/not-found";
import { IconCheck } from "@/components/Icons";
import { courseLevelTitle } from "@/constants";
import { getCourseBySlug } from "@/lib/actions/course.actions";
import { ECourseStatus } from "@/types/enums";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import LessonContent from "@/components/lesson/LessonContent";
import { auth } from "@clerk/nextjs/server";
import { getUserInfo } from "@/lib/actions/user.actions";
import CourseRatingSection from "./CourseRatingSection";
import { getCourseComments } from "@/lib/actions/comment.actions";
import CourseWidget from "./CourseWidget";

const page = async ( { params }: { params: { slug: string }}) => {
    const { slug } = await params;
    const course = await getCourseBySlug({ slug});
    if(!course) return <div>Khóa học không tồn tại</div>;
    
    const { userId} = await auth();
    const findUser = await getUserInfo({ userId: userId || ''})
    
    if(course.status !== ECourseStatus.APPROVED) return <PageNotFound />
    
    const videoId =  course.intro_url?.split("v=")[1];
    const lectures = course.lectures || [];
    
    // Lấy comments của khóa học
    const comments = await getCourseComments(course._id);
    
    // Kiểm tra user đã mua khóa học chưa
    const userHasCourse = findUser?.courses?.some(
        (c: { toString: () => string }) => c.toString() === course._id.toString()
    ) || false;

    return (
        <>  
            <div className="grid lg:grid-cols-[2fr_1fr] gap-15">
                <div>
                    <div className="relative aspect-video mb-5">
                        {course.intro_url ? (
                            <>
                                <iframe 
                                    width="853" 
                                    height="480" 
                                    src= {`https://www.youtube.com/embed/${videoId}`}  
                                >
                                </iframe>
                            </>
                        ) : (
                            <Image 
                            src= {course.image}
                            alt="Course Image"
                            fill
                            className="w-full h-full object-cover rounded-lg"
                        />
                        )}
                    </div>
                    <h1 className="font-bold text-3xl mb-5">{course?.title}</h1>
                    <BoxSection title="Mô tả">
                        <div className="leading-normal">{course.desc}</div>
                    </BoxSection>
                    <BoxSection title="Thông tin">
                        <div className="grid grid-cols-4 gap-5 mb-10">
                            <BoxInfo title="Bài học">100</BoxInfo>
                            <BoxInfo title="Thời lượng">100h45m</BoxInfo>
                            <BoxInfo title="Trình độ">{courseLevelTitle[course.level]}</BoxInfo>
                            <BoxInfo title="Lượt xem">{(course.views).toLocaleString()}</BoxInfo>
                        </div>
                    </BoxSection>
                    <BoxSection title="Nội dung khóa học">
                        <LessonContent lectures={lectures} course="" slug=""/>
                    </BoxSection>
                    <BoxSection title="Lợi ích">
                        {course?.info.benefits.map((b, idx) => (
                            <div key={idx} className="mb-3 flex items-center gap-2">
                                <span className="flex-shrink-0 size-5 bg-pri text-white p-1 rounded-lg flex items-center justify-center"><IconCheck/></span>
                                <span>{b}</span>
                            </div>
                        ))}
                    </BoxSection>
                    <BoxSection title="Yêu cầu">
                        {course?.info.requirements.map((r, idx) => (
                            <div key={idx} className="mb-3 flex items-center gap-2">
                                <span className="flex-shrink-0 size-5 bg-pri text-white p-1 rounded-lg flex items-center justify-center"><IconCheck/></span>
                                <span>{r}</span>
                            </div>
                        ))}
                    </BoxSection>
                    <BoxSection title="Câu hỏi">
                        <div className="leading-normal mb-10">
                            {course?.info.qa.map((qa, index) => (
                                <Accordion type="single" collapsible key={index}>
                                <AccordionItem value={qa.question}>
                                    <AccordionTrigger>{qa.question}</AccordionTrigger>
                                    <AccordionContent>{qa.answer}</AccordionContent>
                                </AccordionItem>
                                </Accordion>
                            ))}
                        </div>
                    </BoxSection>

                    {/* Phần đánh giá */}
                    <CourseRatingSection 
                        courseId={(course._id).toString()}
                        comments={comments ? JSON.parse(JSON.stringify(comments)) : []}
                        userHasCourse={userHasCourse}
                    />
                    
                </div>
                <div>
                    <CourseWidget 
                        course={course ? JSON.parse(JSON.stringify(course)) : null}
                        userHasCourse={userHasCourse}
                        findUser={findUser ? JSON.parse(JSON.stringify(findUser)) : null}
                    />
                </div>
            </div>
        </>
    )
}

function BoxInfo ({ title, children } : { title: string, children: React.ReactNode}) {
    return (
        <>
            <div className="bg-white rounded-lg p-4">
                <h4 className="text-sm text-slate-400">{title}</h4>
                <h3 className="font-bold">{children}</h3>
            </div>
        </>
    )
}

function BoxSection ({title , children } : { title: string, children: React.ReactNode}) {
    return (
        <>  
            <h2 className="font-bold text-xl mb-2">{title}</h2>
            <div className="mb-10">{children}</div>
        </>
    )
}

export default page;