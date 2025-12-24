import { ICourse } from "@/database/course.model";
import { ICategory } from "@/database/category.model";
import { ILesson } from "@/database/lesson.model";

export type TActiveLinkProps = {
    url: string;
    children: React.ReactNode;
}

export type TMenuItem = {
    url: string; 
    title: string; 
    icon?: React.ReactNode;
    onlyIcon?: boolean;
    adminOnly?: boolean;
}

//User 
export type TCreateUserParams ={
    clerkId: string;
    username: string;
    email: string;
    name?: string;
    avatar?: string;
}

export type TGetAllUserParams = {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

export type TUpdateUserParams = {
    userId: string;
    updateData: Partial<IUser>;
    path?: string;
}

//Category
export type TCreateCategoryParams = {
    name: string;
    slug?: string;
}

export type TUpdateCategoryParams = {
    categoryId: string;
    updateData: Partial<ICategory>;
    path?: string;
}

export type TGetAllCategoryParams = {
    page?: number;
    limit?: number;
    search?: string;
}

//Course
export type TCreateCourseParams = {
    title: string;
    slug: string;
    category?: string;
}

export type TUpdateCourseParams = {
    slug: string;
    updateData: Partial<ICourse>;
    path?: string;  
}

export type TUpdateCourseLecture = {
        _id: string;
        title: string;
        lessons: ILesson[];
}

export interface ICourseUpdateParams extends Omit<ICourse, 'lectures'> {
    lectures: TUpdateCourseLecture[];
}

export type TGetAllCourseParams = {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    categorySlug?: string;
}

//Lecture 
export type TCreateLectureParams = {
    course: string;
    title?: string;
    order?: number;
    path?: string;
}

export type TUpdateLectureParams = {
    lectureId: string;
    updateData: {
        title?: string;
        order?: number;
        _destroy?: boolean;
        path?: string;
    }
}

//lesson
export type TCreateLessonParams = {
    lecture: string;
    course: string;
    title?: string;
    order?: number;
    path?: string;
    slug?: string;
}

export type TUpdateLessonParams = {
    lessonId: string;
    path?: string;
    updateData: {
        title?: string;
        slug?: string
        video_url?: string;
        duration?: number;
        content?: string;
        _destroy?: boolean;
    }
}

//history

export type TCreateHistoryParams = {
    course: string;
    lesson: string;
    checked: boolean | string;
    path: string;
}

//Order

export type TCreateOrderParams = {
    code: string;
    course: string;
    user: string;
    total?: number;
    amount?: number;
    discount?: number;
    coupon?: string;
}

//Comment
export type TCreateCommentParams = {
    course: string;
    content: string;
    rating: number;
    path?: string;
}

export type TGetAllCommentsParams = {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    course?: string;
}

export type TUpdateCommentParams = {
    commentId: string;
    updateData: {
        content?: string;
        rating?: number;
        status?: "APPROVED" | "PENDING" | "REJECTED";
    };
    path?: string;
}