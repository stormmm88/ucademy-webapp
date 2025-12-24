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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import slugify from "slugify"
import { createCourse } from "@/lib/actions/course.actions"
import { getAllCategories } from "@/lib/actions/category.actions"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { ICategory } from "@/database/category.model"

const formSchema = z.object({
    title: z.string().min(10, "Tên khóa học phải có ít nhất 10 ký tự"),
    slug: z.string().optional(),
    category: z.string().optional(),
})

function CourseCreate() {

    const [submitting, setSubmitting ] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const router = useRouter();
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            slug: "",
            category: "",
        },
    })

    useEffect(() => {
        const fetchCategories = async () => {
            const cats = await getAllCategories({ limit: 100 });
            if (cats) {
                setCategories(cats);
            }
        };
        fetchCategories();
    }, []);
 
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setSubmitting(true);
        try {
            const data = {
                title: values.title,
                slug: values.slug || slugify(values.title, {
                    lower: true,
                    locale: "vi",
                }),
                category: values.category,
            };
            const res = await createCourse(data);
            if(res?.success){
                toast.success("Tạo khóa học thành công");
            }

            if(res?.data){
                router.push(`/manage/courses/update?slug=${res.data.slug}`);
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

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Danh mục</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem value={String(category._id)} key={String(category._id)}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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