import { getAllComments } from "@/lib/actions/comment.actions";
import CommentManage from "./CommentManage";

const page = async ({ searchParams }: { 
    searchParams: { 
        page: number; 
        search: string; 
        status: string;
    }
}) => {
    const params = await searchParams;
    const comments = await getAllComments({
        page: params.page || 1,
        limit: 5,
        search: params.search,
        status: params.status,
    });

    return (
        <CommentManage comments={comments ? JSON.parse(JSON.stringify(comments)) : []} />
    );
};

export default page;