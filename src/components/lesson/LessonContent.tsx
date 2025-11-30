import { TUpdateCourseLecture } from "@/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LessonItem from "./lessonItem";
import { IHistory } from "@/database/history.model";


const LessonContent = ({
    lectures, 
    course, 
    slug,
    histories = [],
}: {
    lectures: TUpdateCourseLecture[], 
    course: string, 
    slug:string
    histories?: IHistory[];
}) => {
    return (
        <div className="flex flex-col gap-5">
            {/* chưa sửa */}
            {lectures.map((lecture: TUpdateCourseLecture) => (
                <Accordion
                type="single"
                collapsible
                className="w-full mt-2" 
                key={lecture._id}
                >
                <AccordionItem value={lecture._id.toString()}>
                    <AccordionTrigger>
                        <div className="flex items-center gap-3 justify-between w-full pr-5">
                            <div className="line-clamp-1">{lecture.title}</div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="!bg-transparent border-none p-0">
                        <div className="flex flex-col gap-3">
                            {lecture.lessons.map((lesson) => (
                                <LessonItem 
                                    key={lesson._id} 
                                    lesson={lesson ? JSON.parse(JSON.stringify(lesson)): {   }} 
                                    url={!course ? "" : `/${course}/lesson?slug=${lesson.slug}`} 
                                    isActive={!slug ? false : lesson.slug === slug}
                                    isChecked={histories.some((el) => el.lesson.toString() === (lesson._id.toString()))}   
                                />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
            ))}
        </div>
    )
}

export default LessonContent;