'use client';
import Link from "next/link";
import { IconPlay } from "../Icons"
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { createHistory } from "@/lib/actions/history.actons";

const LessonItem = ({
    lesson, 
    url, 
    isActive = false, 
    isChecked = false
}: {
    lesson: {
    title: string;
    duration: number;
    course: string;
    _id: string;
    }, 
    url?: string, 
    isActive?: boolean, 
    isChecked?: boolean
}) => {

    const handleCompleteLesson = async (checked: boolean | string) => {
        try {
            await createHistory({
                course: lesson.course,
                lesson: lesson._id,
                checked,
                path: url || '/',
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className={cn("flex items-center gap-3 rounded-lg p-3 border border-gray-300", isActive ? "text-pri font-semibold" : "hover:bg-gray-50")}>
                { url && (
                    <Checkbox 
                        defaultChecked={isChecked} 
                        className={cn("flex-shrink-0 size-4", )}
                        onCheckedChange={(checked => handleCompleteLesson(checked))}
                    />
                )}
                <IconPlay className="size-4 flex-shrink-0"/>
                {url ? (
                    <Link href={url} className="line-clamp-1">{lesson.title}</Link>
                ) : (
                    <h4 className="line-clamp-1">{lesson.title}</h4>
                )}
                <span className="ml-auto text-xs font-semibold text-slate-500 flex-shrink-0">{lesson.duration} phút</span>
            </div>
        </>
    )
}

export default LessonItem;