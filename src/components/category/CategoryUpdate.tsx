'use client';

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
import { updateCategory } from "@/lib/actions/category.actions"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { ICategory } from "@/database/category.model"

const formSchema = z.object({
  name: z.string().min(3, "Tên danh mục phải có ít nhất 3 ký tự"),
  slug: z.string().optional(),
})

function CategoryUpdate({ data }: { data: ICategory }) {
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
      slug: data.slug,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true)
    try {
      const updateData = {
        name: values.name,
        slug: values.slug || slugify(values.name, {
          lower: true,
          locale: "vi",
        }),
      }

      const res = await updateCategory({
        categoryId: String(data._id),
        updateData,
        path: "/manage/categories",
      })

      if (res?.success) {
        toast.success(res.message)
        router.push("/manage/categories")
      } else {
        toast.error(res?.message || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.log(error)
      toast.error("Có lỗi xảy ra")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 mb-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên danh mục <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Tên danh mục..." {...field} />
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
                <FormLabel>Slug (đường dẫn)</FormLabel>
                <FormControl>
                  <Input placeholder="vd: lap-trinh-web" {...field} />
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
          className="w-[150px]"
          disabled={submitting}
        >
          Cập nhật
        </Button>
      </form>
    </Form>
  )
}

export default CategoryUpdate