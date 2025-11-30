"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import slugify from "slugify"
import { createCourse } from "@/lib/actions/course.actions"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

const formSchema = z.object({                               //formSchema dùng để khai báo những field trong form, validation
    title: z.string().min(10, "Tên khóa học phải có ít nhất 10 ký tự"),
    slug: z.string().optional(),
})

function CourseCreate() {

    const [submitting, setSubmitting ] = useState(false);
    const router = useRouter();
    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
        const data = {
            title: values.title,
            slug: values.slug || slugify(values.title, {
                lower: true,
                locale: "vi",
            }),
        };
        const res = await createCourse(data);
        if(res?.success){
            toast.success("Tạo khóa học thành công");
        }

        if(res?.data){
            router.push(`/manage/courses/update?slug=${res.data.slug}`);  //redirect to course update page
        }

    } catch (error) {
        console.log(error);
    }finally{
        setSubmitting(false);
        form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid grid-cols-2 gap-8 mt-10 mb-8">
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
        </div>
            <Button 
                isLoading={submitting} 
                variant="primary" 
                type="submit" 
                className="w-[120px]"
                disabled={submitting}
            >
                Tạo khóa học
            </Button>
      </form>
    </Form>
  )
}

export default CourseCreate