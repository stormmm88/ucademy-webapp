'use server';

import { TCreateLessonParams, TUpdateLessonParams } from "@/types";
import { connectToDatabase } from "../mongoose";
import Course from "@/database/course.model";
import Lecture from "@/database/lecture.model";
import Lesson, { ILesson } from "@/database/lesson.model";
import { revalidatePath } from "next/cache";

export async function createLesson (params: TCreateLessonParams){
    try {
       connectToDatabase(); 
       const findCourse = await Course.findById(params.course);
       if(!findCourse) throw new Error("Không tìm thấy khóa học");
       const findLecture = await Lecture.findById(params.lecture);
       if(!findLecture) throw new Error("Không tìm thấy chương");
       const newLesson = await Lesson.create(params);
       findLecture.lessons.push(newLesson._id)
       await findLecture.save();
       revalidatePath(params.path || '/');
       if(!newLesson) return;
       return {
        success: true
       };
    } catch (error) {
        console.log(error)
    }
}

export async function updateLesson (params: TUpdateLessonParams){
    try {
       connectToDatabase(); 
       const res = await Lesson.findByIdAndUpdate(params.lessonId, params.updateData, {new: true});
        revalidatePath(params.path || '/'); 
       if(!res) return;
       return {
        success: true
       };
    } catch (error) {
        console.log(error)
    }
}

export async function getLessonBySlug ({ slug, course }: { slug: string; course: string}): Promise<ILesson | undefined> {
    try {
       connectToDatabase(); 
       const findLesson = await Lesson.findOne({slug, course}).select("sulg title video_url content");
       return findLesson;
    }       
    catch (error) {
        console.log(error)
    }
}

export async function findAllLessons ({ course }: {course: string}): Promise<ILesson[] | undefined> {
    try {
       connectToDatabase(); 
       const lessons = await Lesson.find({course});
       return lessons;
    }       
    catch (error) {
        console.log(error)
    }
}

export async function countLessonByCourseId ({ courseId }: {courseId: string}): Promise<number | undefined> {
    try {
       connectToDatabase(); 
       const count = await Lesson.countDocuments({course: courseId});
       return count || 0;
    }       
    catch (error) {
        console.log(error)
    }
}