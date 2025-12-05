'use client';

import { IconStar } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IComment } from "@/database/comment.model";
import { createComment } from "@/lib/actions/comment.actions";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

interface ICommentWithPopulatedUser extends Omit<IComment, 'user'> {
    user: {
        _id: string;
        name: string;
        avatar: string;
    };
}

const CourseRatingSection = ({ 
    courseId, 
    comments = [],
    userHasCourse = false 
}: { 
    courseId: string;
    comments: ICommentWithPopulatedUser[];
    userHasCourse: boolean;
}) => {
    const [rating, setRating] = useState(5);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { userId } = useAuth();

    const handleSubmitReview = async () => {
        if (!userId) {
            toast.error("Vui lòng đăng nhập để đánh giá");
            return;
        }

        if (!content.trim()) {
            toast.error("Vui lòng nhập nội dung đánh giá");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await createComment({
                course: courseId,
                content: content.trim(),
                rating,
                path: window.location.pathname
            });

            if (res?.success) {
                toast.success(res.message);
                setContent("");
                setRating(5);
                // Refresh page để load comments mới
                window.location.reload();
            } else {
                toast.error(res?.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStars = (currentRating: number, isInteractive = false) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={!isInteractive}
                        onClick={() => isInteractive && setRating(star)}
                        onMouseEnter={() => isInteractive && setHoveredRating(star)}
                        onMouseLeave={() => isInteractive && setHoveredRating(0)}
                        className={cn(
                            "transition-transform",
                            isInteractive && "hover:scale-110 cursor-pointer"
                        )}
                    >
                        <IconStar
                            className={cn(
                                "size-5",
                                star <= (isInteractive ? (hoveredRating || rating) : currentRating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                            )}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const approvedComments = comments.filter((c: ICommentWithPopulatedUser) => c.status === "APPROVED");

    return (
        <div className="mt-10">
            <h2 className="font-bold text-xl mb-5">Đánh giá khóa học</h2>

            {/* Form đánh giá - chỉ hiển thị nếu user đã mua khóa học */}
            {userHasCourse && (
                <div className="bg-white dark:bg-grayDarker border border-gray-200 dark:border-gray-200/10 rounded-lg p-5 mb-8">
                    <h3 className="font-semibold mb-3">Viết đánh giá của bạn</h3>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Đánh giá của bạn:
                        </label>
                        {renderStars(rating, true)}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Nội dung:
                        </label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm của bạn về khóa học..."
                            rows={4}
                            className="resize-none"
                        />
                    </div>

                    <Button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting || !content.trim()}
                        isLoading={isSubmitting}
                        variant="primary"
                    >
                        Gửi đánh giá
                    </Button>
                </div>
            )}

            {/* Danh sách đánh giá */}
            <div className="space-y-5">
                {approvedComments.length > 0 ? (
                    approvedComments.map((comment: ICommentWithPopulatedUser) => (
                        <div
                            key={comment._id}
                            className="bg-white dark:bg-grayDarker border border-gray-200 dark:border-gray-200/10 rounded-lg p-5"
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <Image
                                    src={comment.user.avatar || "/default-avatar.png"}
                                    alt={comment.user.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full object-cover size-10"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-semibold">{comment.user.name}</h4>
                                        <span className="text-xs text-gray-500">
                                            {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    {renderStars(comment.rating)}
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed">{comment.content}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        Chưa có đánh giá nào cho khóa học này
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseRatingSection;