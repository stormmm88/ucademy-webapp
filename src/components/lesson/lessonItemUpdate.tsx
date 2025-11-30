/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ILesson } from "@/database/lesson.model";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { updateLesson } from "@/lib/actions/lesson.actions";
import { toast } from "react-toastify";
import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useRef } from "react";
import { editorOptions } from "@/constants";
import { useTheme } from "next-themes";

const formSchema = z.object({
    slug: z.string().optional(),
    duration: z.number().optional(),
    video_url: z.string().optional(),
    content: z.string().optional(),
})
const LessonItemUpdate = ({lesson}: {lesson: ILesson}) => {

    const editorRef = useRef<any>(null);
    const theme = useTheme();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            slug: lesson.slug,
            video_url: lesson.video_url,
            duration: lesson.duration,
            content: lesson.content,
        }
    });

    useEffect(() => {
        setTimeout(() => {
            if(editorRef.current){
                editorRef.current.setContent(lesson.content || '');
            }
        }, 2000);
    }, [lesson.content]);
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const res = await updateLesson({
                lessonId: lesson._id,
                updateData: values,
            });
            if(res?.success){
                toast.success("Cập nhật bài học thành công");
            }
        } catch (error) {
            console.log(error)
        }finally {

        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Đường dẫn</FormLabel>
                                <FormControl>
                                    <Input placeholder="bai-1-tong-quan" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Thời lượng</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="35" 
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
                            name="video_url"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Video URL</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="https://youtube.com/abcdefGHJ" 
                                        {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div></div>
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="col-start-1 col-end-3">
                                <FormLabel>Nội dung</FormLabel>
                                <FormControl>
                                    <Editor
                                        apiKey='7566u6ush38ifk7140seh5ljegakchmecxl9hu1wludmbpwa'
                                        onInit={ (_evt, editor) => {
                                            (editorRef.current = editor).setContent(lesson.content || '');
                                        }}
                                        {...editorOptions(field, theme)}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end gap-5 items-center mt-8">
                        <Button type="submit">Cập nhật</Button>
                        <Link href="/" className="text-sm text-slate-800 border p-2 rounded-lg border-pri/50">Xem trước</Link>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default LessonItemUpdate;