import { getAllUsers } from "@/lib/actions/user.actions";
import { EUserStatus } from "@/types/enums";
import MemberManage from "./MemberManage";

const page = async ({ searchParams }: { 
    searchParams: { 
        page: number; 
        search: string; 
        status: EUserStatus
    }
}) => {
    const params = await searchParams;
    const users = await getAllUsers({
        page: params.page || 1,
        limit: 5,
        search: params.search,
        status: params.status,
    });
    return (
        <MemberManage users={users ? JSON.parse(JSON.stringify(users)) : []} />
    );
}

export default page;