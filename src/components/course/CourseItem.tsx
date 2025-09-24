import Image from "next/image";
import Link from "next/link";
import { IconClock, IconEye, IconStar } from "../Icons";

const courseInfor = [
    {
        title: "5.0",
        icon: (className?: string) => <IconStar className={className}></IconStar>
    },
    {
        title: "1000",
        icon: (className?: string) => <IconEye className={className}></IconEye>
    },
    {   
        title: "30h25p",
        icon:  (className?: string) => <IconClock className={className}></IconClock>
    }
]

const CourseItem = () => {
  return (
    <div className="bg-white dark:bg-grayDarker dark:border-white/10 border border-gray-300 rounded-2xl p-4 relative">
        <Link href="#" className="block h-[200px]">
            <Image
                src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                width={300}
                height={200}
                className="w-full h-full object-cover rounded-lg"
                sizes="@media (min-widtn: 640px) 300px, 100vw"
            />
            <span className="inline-block px-4 py-1 rounded-full absolute top-6 
                right-6 z-10 bg-green-400 text-sm text-white font-medium">
                    Mới
            </span>
        </Link>
        <div className="pt-4">
            <h3 className="font-bold mb-5 text-xl">Khóa học NextJS - Xây dựng E-Learning hoàn chỉnh</h3>
            <div className="flex items-center gap-3 mb-5 text-xs text-gray-500 dark:grayDark">
                {courseInfor.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                        {item.icon("size-4")}
                        <span>{item.title}</span>
                    </div>
                ))}
                <span className="font-semibold text-red-500 ml-auto text-base">700.000 VNĐ</span>
            </div>
            <Link
                href="#"
                className="flex items-center justify-center w-full mt-10 py-3 rounded-xl bg-pri text-white font-medium hover:bg-pri/80 transition"
            >
                Xem chi tiết
            </Link>
        </div>
    </div>
  );
}

export default CourseItem;