/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { CourseGrid } from "@/components/common";
import CourseItem from "@/components/course/CourseItem";
import { ICourse } from "@/database/course.model";
import { lastLessonKey } from "@/constants";

const StudyCourses = ({ courses }: { courses: ICourse[] | null | undefined }) => {

    const [lastLesson, setLastLesson] = useState<any[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const data = JSON.parse(localStorage.getItem(lastLessonKey) || "[]");
            setLastLesson(data);
        }
    }, []);

    if (!courses?.length) return null;

    return (
        <CourseGrid>
            {courses.map((course) => {
                const url =
                    lastLesson.find((el: any) => el.course === course.slug)?.lesson || "/";

                return (
                    <CourseItem
                        key={course.slug}
                        data={course}
                        cta="Học bài"
                        url={url}
                    />
                );
            })}
        </CourseGrid>
    );
};

export default StudyCourses;


