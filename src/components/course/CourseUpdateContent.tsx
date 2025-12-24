'use client'

import { useState, type MouseEvent } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { commonClassNames } from "@/constants";
import { IconCheck, IconDel, IconEdit, IconX } from "../Icons";
import { Button } from "../ui/button";
import { createLecture, updateLectrue } from "@/lib/actions/lecture.actions";
import { toast } from "react-toastify";
import { Input } from '../ui/input';
import Swal from 'sweetalert2';
import { ICourseUpdateParams, TUpdateCourseLecture } from '@/types';
import { cn } from '@/lib/utils';
import { createLesson, updateLesson } from '@/lib/actions/lesson.actions';
import { ILesson } from '@/database/lesson.model';
import slugify from 'slugify';
import LessonItemUpdate from '../lesson/lessonItemUpdate';

const CourseUpdateContent = ( {course}: {course: ICourseUpdateParams}) => {

    const [lectureEdit, setLectureEdit] =  useState('');
    const [lectureIdEdit, setLectureIdEdit] =  useState('');
    const [lessonEdit, setLessonEdit] =  useState('');
    const [lessonIdEdit, setLessonIdEdit] =  useState('');

    //Lưu lectures của course vào biến
    const lectures = course.lectures;

    //Xử lý hàm thêm chương mới
    const handleAddNewLecture = async () => {
        try {
            const res = await createLecture({
                title: 'Chương mới',
                course: course._id,
                order: lectures.length + 1,
                path: `/manage/courses/update-content?slug=${course.slug}`
            })
            if(res?.success){
                toast.success("Thêm chương mới thành công");
            }
        } catch (error) {
            console.log(error)
        }
    }

    //hàm xóa chương
    const handleDelLectrue = async (e: MouseEvent<HTMLSpanElement>, lectureId: string) => {
        e.stopPropagation();
        try {
            Swal.fire({
                title: "Bạn có chắc chắn xóa chương này không?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy",
            }).then( async (result) => {
                if (result.isConfirmed) {
                    const res = await updateLectrue({
                    lectureId,
                    updateData: {
                      _destroy: true,
                      path: `/manage/courses/update-content?slug=${course.slug}`
                    }
                })
                if(res?.success){
                    toast.success('Xóa chương thành công')
                }
            }
        });
        } catch (error) {
            console.log(error)
        }
    }

    //hàm cập nhật chương
    const handleUpdateLecture = async (e: MouseEvent<HTMLSpanElement>, lectureId: string) => {
      e.stopPropagation();
      try {
          {
            const res = await updateLectrue({
              lectureId,
              updateData: {
                title: lectureEdit,
                path: `/manage/courses/update-content?slug=${course.slug}`
              }
            })
            if(res?.success){
              toast.success('Cập nhật chương thành công!');
              setLectureIdEdit('');
              setLectureEdit('');
            }
          }
      } catch (error) {
          console.log(error)
      }
    }

    //hàm thêm bài học mới
    const handleAddNewLesson = async (lectureId: string, courseId: string) => {
      try {
        const res = await createLesson({
          path: `/manage/courses/update-content?slug=${course.slug}`,
          lecture: lectureId,
          course: courseId,
          title: 'Tiêu đề bài học mới',
          slug: `tieu-de-bai-học -${new Date().getTime().toString().slice(-3)}`,
        })
        if(res?.success){
          toast.success('Thêm bài học thành công!');
          return;
        }
        toast.error('Thêm bài học thất bại!')
      } catch (error) {
        console.log(error)
      }
    }

    //hàm cập nhật bài học
    const handleUpdateLesson = async (e: MouseEvent<HTMLSpanElement>, lessonId: string) => {
      e.stopPropagation();
      try {
        const res = await updateLesson({
          lessonId,
          path: `/manage/courses/update-content?slug=${course.slug}`,
          updateData: {
            title: lessonEdit,
            slug: slugify(lessonEdit, {
              lower: true,
              locale: "vi",
              remove: /[*+~.()'"!:@]/g
            })
          }
        })
        if(res?.success){
          toast.success("Cập nhật bài học thành công");
          setLessonEdit("");
          setLessonIdEdit("");
        }
      } catch (error) {
        console.log(error)
      }
    }

    // hàm xóa bài học
    const handleDelLesson = async (e: MouseEvent<HTMLSpanElement>, lessonId: string) => {
      e.stopPropagation();
      try {
        Swal.fire({
                title: "Bạn có chắc chắn xóa bài học này không?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy",
            }).then( async (result) => {
                if (result.isConfirmed) {
                    const res = await updateLesson({
                    lessonId,
                    updateData: {
                      _destroy: true,
                    },
                    path: `/manage/courses/update-content?slug=${course.slug}`
                })
                if(res?.success){
                    toast.success('Xóa chương thành công')
                }
            }
        });
      } catch (error) {
        console.log(error)
      }
    }
    return (
        <>
            <Button onClick={handleAddNewLecture} className="mb-2">Thêm chương mới</Button>

            <div className="flex flex-col gap-5">
              {lectures.map((lecture: TUpdateCourseLecture) => (
                <div key={lecture._id}>
                  <Accordion
                    type="single"
                    collapsible = {!lectureIdEdit}
                    className="w-full mt-2" 
                  >
                    <AccordionItem value={lecture._id}>
                        <AccordionTrigger>
                            <div className="flex items-center gap-3 justify-between w-full pr-5">
                                {lecture._id === lectureIdEdit ? (
                                  <>
                                    <div className="w-full">
                                      <Input 
                                        placeholder="Tên chương"
                                        defaultValue={lecture.title}
                                        onChange={(e) => setLectureEdit(e.target.value)}
                                      />
                                    </div>

                                    <div className="flex gap-2">
                                      <span 
                                        className={cn(commonClassNames.action, "text-green-500")}
                                        onClick={(e) => handleUpdateLecture(e, lecture._id)}
                                      >
                                          <IconCheck className="size-4"/>
                                      </span>
                                      <span 
                                          className={cn(commonClassNames.action, "text-red-500")} 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setLectureIdEdit('');
                                          }}
                                      >
                                          <IconX className="size-4"/>
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div>{lecture.title}</div>
                                    <div className="flex gap-2">
                                      <span 
                                        className={cn(commonClassNames.action, "text-blue-500")}
                                        onClick={(e) => {
                                              e.stopPropagation();
                                              setLectureEdit(lecture.title);
                                              setLectureIdEdit(lecture._id);
                                        }}
                                      >
                                          <IconEdit className="size-4"/>
                                      </span>
                                      <span 
                                          className={cn(commonClassNames.action, "text-red-500")} 
                                          onClick={(e) => handleDelLectrue(e, lecture._id)}
                                      >
                                          <IconDel className="size-4"/>
                                      </span>
                                    </div>
                                  </>
                                )}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="border-none !bg-transparent">
                          <div className="flex flex-col gap-5">
                            {lecture.lessons.map((lesson: ILesson) => (
                              <Accordion type="single" collapsible={!lessonIdEdit} key={lesson._id}>
                                <AccordionItem value={lesson._id}>
                                  <AccordionTrigger>
                                    <div className="flex items-center gap-3 justify-between w-full pr-5">
                                      {lesson._id === lessonIdEdit ? (
                                        <>
                                          <div className="w-full">
                                            <Input 
                                              placeholder="Tên bài học"
                                              defaultValue={lesson.title}
                                              onChange={(e) => setLessonEdit(e.target.value)}
                                            />
                                          </div>

                                          <div className="flex gap-2">
                                            <span 
                                              className={cn(commonClassNames.action, "text-green-500")}
                                              onClick={(e) => handleUpdateLesson(e, lesson._id)}
                                            >
                                                <IconCheck className="size-4"/>
                                            </span>
                                            <span 
                                                className={cn(commonClassNames.action, "text-red-500")} 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setLessonIdEdit('');
                                                }}
                                            >
                                                <IconX className="size-4"/>
                                            </span>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div>{lesson.title}</div>
                                          <div className="flex gap-2">
                                            <span 
                                              className={cn(commonClassNames.action, "text-blue-500")}
                                              onClick={(e) => {
                                                    e.stopPropagation();
                                                    setLessonIdEdit(lesson._id);
                                              }}
                                            >
                                                <IconEdit className="size-4"/>
                                            </span>
                                            <span 
                                                className={cn(commonClassNames.action, "text-red-500")} 
                                                onClick={(e) => handleDelLesson(e, lesson._id)}
                                            >
                                                <IconDel className="size-4"/>
                                            </span>
                                          </div>
                                        </>
                                      )}
                                  </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <LessonItemUpdate lesson={lesson}></LessonItemUpdate>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <Button 
                      onClick={() => handleAddNewLesson(lecture._id, course._id)} 
                      className="mt-2 ml-auto w-fit block"
                    >
                      Thêm bài học
                    </Button>
                </div>
              ))}
            </div>
        </>
    )
}

export default CourseUpdateContent;