import PageNotFound from "@/app/not-found";
import { getUserInfo } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import LoadingPlayer from "./@player/LoadingPlayer";
import LoadingOutline from "./@outline/LoadingOutline";


const Layout = async ({
    player,
    outline,
}: {
    player: React.ReactNode;
    outline: React.ReactNode;
}) => {

    const { userId } = await auth();
    if(!userId) return <PageNotFound />;
    const findUser = await getUserInfo({ userId });
    if(!findUser) return <PageNotFound />;

    return (
        <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-10 min-h-screen items-start">
            <Suspense fallback={<LoadingPlayer/>}>{player}</Suspense> 
            <Suspense fallback={<LoadingOutline/>}>{outline}</Suspense>
            {/* fallback: trước khi chạy vào component player sẽ chạy LoadingPlayer */}
        </div>
    )
}

export default Layout;