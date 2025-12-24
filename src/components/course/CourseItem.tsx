import Image from "next/image";
import Link from "next/link";
import { IconClock, IconEye, IconStar } from "../Icons";
import { ICourse } from "@/database/course.model";
import { commonClassNames } from "@/constants";

const CourseItem = ({ data, cta, url = "" }: { data: ICourse, cta?: string, url?: string }) => {
    const courseInfor = [
    {
        title: data.rating?.length > 0 ? (data.rating.reduce((a, b) => a + b, 0) / data.rating.length).toFixed(1) : 0,
        icon: (className?: string) => <IconStar className={className}></IconStar>
    },
    {
        title: (data.views).toLocaleString(),
        icon: (className?: string) => <IconEye className={className}></IconEye>
    },
    {   
        title: "30h25p",
        icon:  (className?: string) => <IconClock className={className}></IconClock>
    }
  ]
  const courseUrl = url ? url : `/course/${data.slug}`;
  
  return (
    <div className="bg-white dark:bg-grayDarker dark:border-white/10 border border-gray-300 rounded-2xl p-4 relative flex flex-col">
        <Link href={courseUrl} className="block h-[200px]">
            <Image
                src={data.image}
                alt=""
                width={300}
                height={200}
                className="w-full h-full object-cover rounded-lg"
                sizes="@media (min-widtn: 640px) 300px, 100vw"
            />
            <span className="inline-block px-4 py-1 rounded-full absolute top-6 
                right-6 z-10 bg-green-400 text-sm text-white font-medium">
                    Giảm {Math.round(100 - (Number(data?.sale_price) / Number(data?.price) * 100))}%
            </span>
        </Link>
        <div className="pt-4 flex flex-col flex-1">
            <h3 className="font-bold mb-5 text-xl">{data.title}</h3>
            <div className="mt-auto">
                <div className="flex items-center gap-3 mb-5 text-xs text-gray-500 dark:grayDark">
                    {courseInfor.map((item, index) => (
                        <div key={index} className="flex items-center gap-1">
                            {item.icon("size-4")}
                            <span>{item.title}</span>
                        </div>
                    ))}
                    <span className="font-semibold text-red-500 ml-auto text-base">{(data.price).toLocaleString()}VNĐ</span>
                </div>
                <Link
                    href={courseUrl}
                    className={commonClassNames.primaryBtn}
                >
                    {cta || 'Xem chi tiết'}
                </Link>
            </div>
        </div>
    </div>
  );
}

export default CourseItem;
// import Image from "next/image";
// import Link from "next/link";
// import { IconClock, IconEye, IconStar } from "../Icons";
// import { ICourse } from "@/database/course.model";

// const CourseItem = ({ data, cta, url = "" }: { data: ICourse, cta?: string, url?: string }) => {
//   const avgRating = data.rating?.length > 0 
//     ? (data.rating.reduce((a, b) => a + b, 0) / data.rating.length).toFixed(1) 
//     : 0;

//   const courseUrl = url ? url : `/course/${data.slug}`;
//   return (
//     <Link href={courseUrl}>
//       <div className="relative h-full bg-gradient-to-br from-white to-gray-50 
//         dark:from-grayDarker dark:to-black/50 rounded-3xl overflow-hidden 
//         border border-gray-200/50 dark:border-white/5 shadow-lg 
//         hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col">
        
//         {/* Image Container with Effects */}
//         <div className="relative h-[220px] overflow-hidden bg-gradient-to-br 
//           from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black group">
          
//           {/* Animated Background Pattern */}
//           <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
//           </div>

//           {/* Image */}
//           <Image
//             src={data.image}
//             alt={data.title}
//             width={300}
//             height={220}
//             className="w-full h-full object-cover hover:scale-125 
//               transition-transform duration-700 ease-out"
//             sizes="(min-width: 640px) 300px, 100vw"
//             priority={false}
//           />
          
//           {/* Animated Overlay */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent 
//             opacity-0 hover:opacity-100 transition-all duration-500" />

//           {/* New Badge */}
//           <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full 
//             absolute top-4 right-4 z-20 bg-gradient-to-r from-green-400 via-emerald-400 
//             to-teal-500 text-xs text-white font-bold shadow-xl drop-shadow-lg
//             hover:scale-110 hover:rotate-6 transition-all duration-300">
//             ✨ Mới
//           </span>

//           {/* Rating Badge */}
//           <div className="absolute bottom-4 left-4 z-20 bg-white/95 dark:bg-black/80 
//             backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 
//             shadow-xl border border-white/20 dark:border-white/10
//             hover:bottom-6 transition-all duration-300 hover:scale-110">
//             <IconStar className="size-4 text-yellow-400 fill-yellow-400" />
//             <span className="text-sm font-bold text-gray-900 dark:text-white">{avgRating}</span>
//           </div>
//         </div>

//         {/* Content Container */}
//         <div className="p-5 flex-1 flex flex-col">
//           {/* Title */}
//           <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-gray-900 
//             via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white 
//             bg-clip-text text-transparent line-clamp-2 hover:line-clamp-3 
//             transition-all duration-300">
//             {data.title}
//           </h3>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-100/50 dark:bg-white/5 
//             p-3 rounded-2xl border border-gray-200/50 dark:border-white/5
//             hover:bg-pri/5 dark:hover:bg-pri/10 transition-all duration-300">
            
//             <div className="flex flex-col items-center py-2 px-2 rounded-lg 
//               hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors">
//               <div className="flex items-center gap-1 text-xs font-semibold text-pri mb-1">
//                 <IconEye className="size-3.5" />
//                 <span>{(data.views).toLocaleString()}</span>
//               </div>
//               <span className="text-xs text-gray-500 dark:text-gray-400">Lượt xem</span>
//             </div>
            
//             <div className="flex flex-col items-center py-2 px-2 rounded-lg 
//               hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors border-l border-r 
//               border-gray-300/30 dark:border-white/10">
//               <div className="flex items-center gap-1 text-xs font-semibold text-blue-500 mb-1">
//                 <IconClock className="size-3.5" />
//                 <span>30h25p</span>
//               </div>
//               <span className="text-xs text-gray-500 dark:text-gray-400">Thời lượng</span>
//             </div>
            
//             <div className="flex flex-col items-center py-2 px-2 rounded-lg 
//               hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors">
//               <div className="flex items-center gap-1 text-xs font-semibold text-orange-500 mb-1">
//                 <IconStar className="size-3.5 fill-orange-500" />
//                 <span>{avgRating}</span>
//               </div>
//               <span className="text-xs text-gray-500 dark:text-gray-400">Đánh giá</span>
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent 
//             dark:via-white/10 my-3 hover:via-pri/50 transition-all duration-300" />

//           {/* Price Section */}
//           <div className="flex items-center justify-between mb-4 mt-auto">
//             <div className="flex flex-col">
//               <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
//                 Giá khóa học
//               </span>
//               <span className="text-2xl font-black bg-gradient-to-r from-pri to-blue-600 
//                 bg-clip-text text-transparent">
//                 {(data.price).toLocaleString()}₫
//               </span>
//             </div>
//             <div className="text-right text-xs text-gray-500 dark:text-gray-400">
//               <div className="font-semibold text-pri mb-1">Bắt đầu ngay</div>
//               <div className="text-xs">→ Hơn 5k học viên</div>
//             </div>
//           </div>

//           {/* CTA Button */}
//           <button className="relative w-full py-3 rounded-2xl 
//             bg-gradient-to-r from-pri to-blue-600 text-white font-bold 
//             shadow-xl hover:shadow-2xl transition-all duration-300 
//             hover:scale-105 active:scale-95 overflow-hidden text-base
//             border border-pri/50 hover:border-pri">
            
//             {/* Button Glow */}
//             <div className="absolute inset-0 bg-gradient-to-r from-white/0 
//               via-white/20 to-white/0 opacity-0 hover:opacity-100 
//               transition-opacity duration-300" />
            
//             {/* Button Content */}
//             <div className="relative flex items-center justify-center gap-2">
//               <span className="text-base">{cta || "Xem chi tiết"}</span>
//               <svg className="size-5 opacity-0 -translate-x-2 hover:opacity-100 
//                 hover:translate-x-0 transition-all duration-300" 
//                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} 
//                   d="M13 7l5 5m0 0l-5 5m5-5H6" />
//               </svg>
//             </div>
//           </button>

//           {/* Trust Badge */}
//           <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
//             <span className="inline-flex items-center gap-1">
//               <svg className="size-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//               </svg>
//               Chứng chỉ cấp sau hoàn thành
//             </span>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default CourseItem;