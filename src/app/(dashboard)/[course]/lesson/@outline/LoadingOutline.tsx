const LoadingOutline = () => {
    return (
         <div>
            <div className="h-3 w-full rounded-full mb-2 bg-gray-200 dark:grayDarker animate-pulse"></div>
            <div className="flex flex-col gap-5">
                <div className="bg-gray-200 dark:grayDarker animate-pulse w-full h-14 rounded-lg"></div>
                <div className="bg-gray-200 dark:grayDarker animate-pulse w-full h-14 rounded-lg"></div>
            </div>
        </div>
)
}

export default LoadingOutline;