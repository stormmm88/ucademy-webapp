import { TMenuItem } from "@/types"
import { IconPlay, AcademicCap, IconStudy, IconUsers, IconStack, IconCmt } from "../components/Icons"

export const menuItem: TMenuItem[] = [
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
        title: "Quan lý học viên", 
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
    }
]