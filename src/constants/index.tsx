/* eslint-disable @typescript-eslint/no-explicit-any */
import { TMenuItem } from "@/types"
import { IconPlay, AcademicCap, IconStudy, IconUsers, IconStack, IconCmt, CategoryIcon } from "../components/Icons"
import { ECourseLevel, ECourseStatus, EOrderStatus } from "@/types/enums"

export const menuItem: (TMenuItem & { adminOnly?: boolean })[] = [
    {
        url: "/", 
        title: "Khám phá", 
        icon: <IconPlay className="size-5"/>    
    },
    {
        url: "/study", 
        title: "Khóa học của tôi", 
        icon: <AcademicCap className="size-5"/>    
    },
    {
        url: "/manage/courses", 
        title: "Quản lý khóa học", 
        icon: <IconStudy className="size-5"/>    
    },
    {
        url: "/manage/members", 
        title: "Quản lý học viên", 
        icon: <IconUsers className="size-5"/>    
    },
    {
        url: "/manage/orders", 
        title: "Quản lý đơn hàng", 
        icon: <IconStack className="size-5"/>    
    },
    {
        url: "/manage/comments", 
        title: "Quản lý bình luận", 
        icon: <IconCmt className="size-5"/>    
    },
    {
        url: "/manage/categories", 
        title: "Quản lý danh mục", 
        icon: <CategoryIcon className="size-5"/>    
    }
]

//Status
export const courseStatus: {
    title: string,
    value: ECourseStatus
    className?: string;
}[] = [
    {
        title: "Đã duyệt",
        value: ECourseStatus.APPROVED,
        className: "text-green-500"
    },
    {
        title: "Chờ duyệt",
        value: ECourseStatus.PENDING,
        className: "text-orange-500"
    },
    {
        title: "Từ chối",
        value: ECourseStatus.REJECTED,
        className: "text-red-500"
    }
];

export const orderStatus: {
    title: string,
    value: EOrderStatus
    className?: string;
}[] = [
    {
        title: "Đã duyệt",
        value: EOrderStatus.COMPLETED,
        className: "text-green-500"
    },
    {
        title: "Chờ duyệt",
        value: EOrderStatus.PENDING,
        className: "text-orange-500"
    },
    {
        title: "Đã hủy",
        value: EOrderStatus.CANCELED,
        className: "text-red-500"
    }
];

//Level
export const courseLevel: {
    title: string,
    value: ECourseLevel
}[] = [
    {
        title: "Dễ",
        value: ECourseLevel.BEGINNER
    },
    {
        title: "Trung bình",
        value: ECourseLevel.INTERMEDIATE
    },
    {
        title: "Khó",
        value: ECourseLevel.ADVANCED
    }
]

//Level tiếng việt

export const courseLevelTitle: Record<ECourseLevel, string> = {
    [ECourseLevel.BEGINNER]: "Dễ",
    [ECourseLevel.INTERMEDIATE]: "Trung bình",
    [ECourseLevel.ADVANCED]: "Khó",
}

//Class dùng chung cho status
export const commonClassNames = {
    status: "bg-current/10 border border-current rounded-md font-medium lg:px-3 py-1 whitespace-nowrap px-2 cursor-pointer",
    action: "rounded-md border border-gray-200 flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 dark:bg-transparent dark:border-gray-200/10 hover:dark:bg-grayDarkest cursor-pointer",
    primaryBtn: "flex items-center justify-center w-full mt-10 rounded-lg bg-pri text-white font-semibold h-12 button-primary"
}

export const editorOptions = (field: any, theme: any) => ({
  initialValue: '',
  onBlur: field.onBlur,
  onEditorChange: (content: any) => field.onChange(content),
  init: {
    codesample_global_prismjs: true,
    skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
    height: 300,
    menubar: false,
    plugins: [
      'advlist',
      'autolink',
      'lists',
      'link',
      'image',
      'charmap',
      'preview',
      'anchor',
      'searchreplace',
      'visualblocks',
      'codesample',
      'fullscreen',
      'insertdatetime',
      'media',
      'table',
      'heading',
    ],
    toolbar:
      'undo redo | ' +
      'codesample | bold italic forecolor | alignleft aligncenter |' +
      'alignright alignjustify | bullist numlist |' +
      'image |' +
      'h1 h2 h3 h4 h5 h6 | preview | fullscreen |' +
      'link',
    content_style:
      "@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap');body { font-family: Manrope,Helvetica,Arial,sans-serif; font-size:14px; line-height: 2; padding-bottom: 32px; } img { max-width: 100%; height: auto; display: block; margin: 0 auto; };",
  },
});

export const lastLessonKey = "lastLesson";