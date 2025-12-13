/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { IconPlay, IconStudy, IconUsers } from "@/components/Icons";
import ButtonEnroll from "./ButtonEnroll";

const CourseWidget = ({course, userHasCourse, findUser}: {course: any, userHasCourse: any, findUser: any}) => {
  return (
    <>
        <div className="bg-white rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
                <strong className="text-pri text-lg font-bold">{(course?.sale_price).toLocaleString()}₫</strong>
                <span className="text-slate-500 text-xs line-through">{(course?.price).toLocaleString()}₫</span>
                <span className="ml-auto inline-block px-3 py-1 rounded-lg bg-pri/10 font-semibold text-sm text-pri">
                    {Math.round(100 - (Number(course?.sale_price) / Number(course?.price) * 100))}%
                </span>
            </div>
            <h4 className="font-bold mb-3 text-md">Thông tin khóa học:</h4>
            <ul className="flex flex-col mb-3 gap-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                    <IconPlay className="size-4"/>
                    <span>30 giờ học</span>
                </li>
                <li className="flex items-center gap-2">
                    <IconPlay className="size-4"/>
                    <span>Video Full HD</span>
                </li>
                <li className="flex items-center gap-2">
                    <IconUsers className="size-4"/>
                    <span>Có nhóm hỗ trợ </span>
                </li>
                <li className="flex items-center gap-2">
                    <IconStudy className="size-4"/>
                    <span>Tài liệu kèm theo</span>
                </li>
            </ul>
            {userHasCourse ? (
                <div className="bg-green-100 text-green-700 rounded-lg p-3 text-center font-semibold">
                    Bạn đã sở hữu khóa học này
                </div>
            ) : (
                <ButtonEnroll 
                    user={findUser ? JSON.parse(JSON.stringify(findUser)) : null}
                    courseId= {course ? JSON.parse(JSON.stringify(course._id)) : null}
                    amount={course.price}    
                />
            )}
        </div>
    </>
  );
}

export default CourseWidget;