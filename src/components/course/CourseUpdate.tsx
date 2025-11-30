'use client';

import { Textarea } from "../ui/textarea";
import z from "zod";
import { ECourseLevel, ECourseStatus } from "@/types/enums";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { updateCourse } from "@/lib/actions/course.actions";
import { ICourse } from "@/database/course.model";
import { toast } from "react-toastify";
import { useImmer } from "use-immer";
import { IconAdd } from "../Icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { courseLevel, courseStatus } from "@/constants";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(10, "Tên khóa học phải có ít nhất 10 ký tự"),
  slug: z.string().optional(),
  price: z.number().int().optional(),
  sale_price: z.number().int().positive().optional(),
  intro_url: z.string().optional(),
  desc: z.string().optional(),
  image: z.string().optional(),
  views: z.number().int().optional(),
  status: z.enum([
    ECourseStatus.APPROVED,
    ECourseStatus.PENDING,
    ECourseStatus.REJECTED,
  ]),
  level: z.enum([
    ECourseLevel.ADVANCED,
    ECourseLevel.BEGINNER,
    ECourseLevel.INTERMEDIATE,
  ]),
  info: z.object({
    benefits: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    qa: z.array(z.object({
      question: z.string().optional(),
      answer: z.string().optional(),
    })),
  })
})

const CourseUpdate = ({ data }: { data: ICourse}) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [courseInfo, setCourseInfo] = useImmer({
    requirements: data.info.requirements,
    benefits: data.info.benefits,
    qa: data.info.qa
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: data.title,
      slug: data.slug,
      price: data.price || 0,
      sale_price: data.sale_price || 0,
      intro_url: data.intro_url || "",
      desc: data.desc || "",
      image: data.image || "",
      views: data.views || 0,
      status: data.status || ECourseStatus.PENDING,
      level: data.level || ECourseLevel.BEGINNER,
      info: {
        benefits: data.info?.benefits || [],
        requirements: data.info?.requirements || [],
        qa: data.info?.qa || [],
      }
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    console.log(courseInfo.requirements)
    try {
      const res = await updateCourse({
        slug: data.slug,
        updateData: {
          title: values.title,
          slug: values.slug,
          price: values.price,  
          sale_price: values.sale_price,
          intro_url: values.intro_url,
          desc: values.desc,  
          image: values.image,
          views: values.views,
          status: values.status,
          level: values.level,
          info: {
            requirements: courseInfo.requirements,
            benefits: courseInfo.benefits,
            qa: courseInfo.qa
          }
        },
      })
      if(values.slug !== data.slug){
        router.replace(`/manage/courses/update?slug=${values.slug}`);
      }
      if(res?.success) {
        toast.success(res.message || "Cập nhật khóa học thành công");
        router.refresh();
      }

    } catch (error) {
      console.log(error);
    }finally {
      setSubmitting(false);
    }
  }

  const imageWatch = form.watch("image");

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 mb-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khóa học <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Tên khóa học..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Đường dẫn khóa học</FormLabel>
                <FormControl>
                  <Input placeholder="VD: khoa-hoc-lap-trinh" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sale_price"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Giá khuyến mãi</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="VD: 499.000" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Giá gốc</FormLabel>
                <FormControl>
                  <Input  
                    type="number"
                    placeholder="VD: 999.000" 
                    {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                  
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Mô tả khóa học</FormLabel>
                <FormControl>
                  <Textarea placeholder="Nhập mô tả..." {...field}  rows={8} className="h-[250px]"/>
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Ảnh đại diện</FormLabel>
                <FormControl>
                  <div className="h-[250px] bg-white rounded-md border border-gray-200 flex items-center justify-center relative">
                    {!imageWatch ? (
                      <UploadButton
                      className="mt-4 ut-button:bg-blue-500 ut-button:ut-readying:bg-blue-500/50"
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => {
                        // Do something with the response
                        form.setValue("image", res[0].ufsUrl)
                      }}
                      onUploadError={(error: Error) => {
                        // Do something with the error.
                        console.error(`ERROR! ${error.message}`);
                      }}
                    />
                    ) : (
                      <Image src={imageWatch} alt="" fill className="w-full h-full object-cover rounded-md"/>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="intro_url"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Youtube URL</FormLabel>
                <FormControl>
                  <Input placeholder="VD: https://www.youtube.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="views"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Lượt xem</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    placeholder="" {...field} 
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseStatus.map((status) => (
                        <SelectItem value={status.value} key={status.value}>{status.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Độ khó</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Trình độ" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseLevel.map((level) => (
                        <SelectItem value={level.value} key={level.value}>{level.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="info.benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between gap-5">
                    <span>Lợi ích</span>
                    <button 
                      className="text-pri"
                      onClick={() => {
                        setCourseInfo((draft) => {
                          draft.benefits.push("")
                        });
                      }}
                      type="button"
                    >
                      <IconAdd className="size-5"/>
                    </button>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {courseInfo.benefits.map((b, index) => (
                        <Input 
                          key={index}
                          placeholder={`Lợi ích số ${index + 1}`}
                          value={b}
                          onChange={(e) => {
                            setCourseInfo((draft) => {
                              draft.benefits[index] = e.target.value  
                            })
                          }}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Yêu cầu */}
            <FormField
              control={form.control}
              name="info.requirements"
              render={({ field }) => (
                <FormItem>
                <FormLabel className="flex items-center justify-between gap-5">
                  <span>Yêu cầu</span>
                  <button 
                    className="text-pri"
                    onClick={() => {
                      setCourseInfo((draft) => {
                        draft.requirements.push("")
                      });
                    }}
                    type="button"
                  >
                    <IconAdd className="size-5"/>
                  </button>
                </FormLabel>
                <FormControl>
                  <div className="flex flex-col gap-2">
                    {courseInfo.requirements.map((r, index) => (
                      <Input
                        key={index}
                        placeholder={`Yêu cầu số ${index + 1}`}
                        value={r} 
                        onChange={(e) => {
                          setCourseInfo((draft) => {
                            draft.requirements[index] = e.target.value  
                          })
                        }}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="info.qa"
              render={({ field }) => (
                <FormItem className="col-start-1 col-end-3">
                  <FormLabel className="flex items-center justify-between gap-5">
                    <span>Câu hỏi/Trả lời</span>
                    <button 
                      className="text-pri"
                      onClick={() => {
                        setCourseInfo((draft) => {
                          draft.qa.push({
                            question: "",
                            answer: "",
                          })
                        });
                      }}
                      type="button"
                    >
                      <IconAdd className="size-5"/>
                    </button>
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-2">
                      {courseInfo.qa.map((item, index) => (
                        <div className="grid grid-cols-2 gap-5" key={index}>
                          <Input
                          
                          placeholder={`Câu hỏi số ${index + 1}`}
                          value={item.question} 
                          onChange={(e) => {
                            setCourseInfo((draft) => {
                              draft.qa[index].question = e.target.value  
                            })
                          }}
                        />
                        <Input
                          
                          placeholder={`Câu trả lời số ${index + 1}`}
                          value={item.answer} 
                          onChange={(e) => {
                            setCourseInfo((draft) => {
                              draft.qa[index].answer = e.target.value  
                            })
                          }}
                        />
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button 
            isLoading={submitting} 
            variant="primary" 
            type="submit" 
            className="w-[120px]"
            disabled={submitting}
          >
            Cập nhật
          </Button>
        </form>
      </Form>
    </>
  )
}   
export default CourseUpdate;