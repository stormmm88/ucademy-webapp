import Link from "next/link"

const PageNotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen ">
            <h1 className="font-bold text-7xl">404</h1>
            <h2 className="mb-5">Page Not Found</h2>
            <Link href="/" className="flex items-center gap-2 hover:text-primary">
                Trang chủ
            </Link>
        </div>
    )
}

export default PageNotFound;