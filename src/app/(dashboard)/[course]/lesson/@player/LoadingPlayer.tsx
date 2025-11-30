const LoadingPlayer = () => {
    return (
         <div>
            <div className="aspect-video rounded-lg mb-5 bg-gray-200 dark:grayDarker animate-pulse"></div>
            <div className="flex gap-3 mb-5">
                <div className="size-10 rounded-lg bg-gray-200 dark:grayDarker animate-pulse"></div>
                <div className="size-10 rounded-lg bg-gray-200 dark:grayDarker animate-pulse"></div>
            </div>
            <div className="w-full h-9 mb-10 bg-gray-200 dark:grayDarker animate-pulse"></div>
        </div>
    )
}

export default LoadingPlayer;