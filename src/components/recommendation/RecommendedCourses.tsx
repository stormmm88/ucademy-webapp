'use client';

import Link from "next/link";
import Image from "next/image";
import { ICourse } from "@/database/course.model";
import { IconStar, IconEye } from "@/components/Icons";

const RecommendedCoursesSmall = ({ courses }: { courses: ICourse[] }) => {
    if (!courses || courses.length === 0) {
        return null;
    }

    return (
        <div>
            <h3 className="font-bold text-base mb-4 text-gray-800 dark:text-white">Khóa học dành cho bạn</h3>
            <div className="space-y-3">
                {courses.map((course) => {
                    const avgRating = course.rating?.length > 0 
                        ? (course.rating.reduce((a, b) => a + b, 0) / course.rating.length).toFixed(1) 
                        : 0;

                    return (
                        <Link
                            key={course.slug}
                            href={`/course/${course.slug}`}
                            className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
                        >
                            {/* Image */}
                            <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-2 group-hover:text-pri transition-colors">
                                    {course.title}
                                </h4>
                                
                                {/* Stats */}
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <IconStar className="size-3 text-yellow-400 fill-yellow-400" />
                                        <span>{avgRating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <IconEye className="size-3" />
                                        <span>{(course.views).toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="mt-2 text-sm font-semibold text-pri">
                                    {(course.sale_price || course.price).toLocaleString()}₫
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default RecommendedCoursesSmall;